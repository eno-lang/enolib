# frozen_string_literal: true

module Enolib
  class Fieldset < ElementBase
    attr_reader :instruction, :touched

    def initialize(context, instruction, parent = nil)
      super(context, instruction, parent)

      @all_entries_required = parent ? parent.all_elements_required? : false
    end

    def _missing_error(entry)
      raise Errors::Validation.missing_element(@context, entry.key, @instruction, 'missing_fieldset_entry')
    end

    def _untouched
      return @instruction unless instance_variable_defined?(:@touched)

      untouched_entry = _entries.find { |entry| !entry.instance_variable_defined?(:@touched) }

      untouched_entry ? untouched_entry.instruction : false
    end

    def all_entries_required(required = true)
      @all_entries_required = required
    end

    def assert_all_touched(message = nil, except: nil, only: nil, &block)
      message = Proc.new(&block) if block_given?

      _entries(map: true).each do |key, entries|
        next if except && except.include?(key) || only && !only.include?(key)

        entries.each do |entry|
          next if entry.touched  # TODO: Revisit instance var existance question in ruby

          if message.is_a?(Proc)
            message = message.call(entry)
          end

          raise Errors::Validation.unexpected_element(@context, message, entry[:instruction])
        end
      end
    end

    def entries(key = nil)
      @touched = true

      if key
        entries_map = _entries(map: true)
        entries_map.has_key?(key) ? entries_map[key] : []
      else
        _entries
      end
    end

    def entry(key = nil)
      _entry(key)
    end

    def optional_entry(key)
      _entry(key, required: false)
    end

    def parent
      @parent || Section.new(@context, @instruction[:parent])
    end

    def required_entry(key = nil)
      _entry(key, required: true)
    end

    def to_s
      "#<Enolib::Fieldset key=#{@instruction[:key]} entries=#{_entries.length}>"
    end

    def touch
      @touched = true

      _entries.each(&:touch)
    end

    private

    def _entries(map: false)
      unless instance_variable_defined?(:@instantiated_entries)
        @instantiated_entries = []
        @instantiated_entries_map = {}
        instantiate_entries(@instruction)
      end

      map ? @instantiated_entries_map : @instantiated_entries
    end

    def _entry(key = nil, required: nil)
      @touched = true

      if key
        entries_map = _entries(map: true)
        entries = entries_map.has_key?(key) ? entries_map[key] : []
      else
        entries = _entries
      end

      if entries.empty?
        if required || required == nil && @all_entries_required
          raise Errors::Validation.missing_element(@context, key, @instruction, 'missing_fieldset_entry')
        elsif required == nil
          return MissingFieldsetEntry.new(key, self)
        else
          return nil
        end
      end

      if entries.length > 1
        raise Errors::Validation.unexpected_multiple_elements(
          @context,
          key,
          entries.map(&:instruction),
          'expected_single_fieldset_entry'
        )
      end

      entries[0]
    end

    def instantiate_entries(fieldset)
      if fieldset.has_key?(:entries)
        filtered = fieldset[:entries].reject { |entry| @instantiated_entries_map.has_key?(entry[:key]) }
        native_entries = filtered.map do |entry|
          instance = FieldsetEntry.new(@context, entry, self)

          if @instantiated_entries_map.has_key?(entry[:key])
            @instantiated_entries_map[entry[:key]].push(instance)
          else
            @instantiated_entries_map[entry[:key]] = [instance]
          end

          instance
        end

        @instantiated_entries.concat(native_entries)
      end
    end
  end
end
