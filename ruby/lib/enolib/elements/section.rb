# frozen_string_literal: true

# TODO: For each value store the representational type as well ? (e.g. string may come from "- foo" or -- foo\nxxx\n-- foo) and use that for precise error messages?

module Enolib
  class Section < ElementBase
    def initialize(context, instruction, parent = nil)
      super(context, instruction, parent)

      @all_elements_required = parent ? parent.all_elements_required? : false
    end

    def _missing_error(element)
      case element
      when MissingField
        raise Errors::Validation.missing_element(@context, element.instance_variable_get(:@key), @instruction, 'missing_field')
      when MissingFieldset
        raise Errors::Validation.missing_element(@context, element.instance_variable_get(:@key), @instruction, 'missing_fieldset')
      when MissingList
        raise Errors::Validation.missing_element(@context, element.instance_variable_get(:@key), @instruction, 'missing_list')
      when MissingSection
        raise Errors::Validation.missing_element(@context, element.instance_variable_get(:@key), @instruction, 'missing_section')
      else
        raise Errors::Validation.missing_element(@context, element.instance_variable_get(:@key), @instruction, 'missing_element')
      end
    end

    def _untouched
      return @instruction unless instance_variable_defined?(:@touched)

      _elements.each do |element|
        untouched_element = element._untouched
        return untouched_element if untouched_element
      end

      false
    end

    def all_elements_required(required = true)
      @all_elements_required = required

      _elements.each do |element|
        if element.instruciton[:type] == :section && element.yielded?
          element.to_section.all_elements_required(required)
        elsif element.instruciton[:type] == :fieldset && element.yielded?
          element.to_fieldset.all_entries_required(required)
        end
      end
    end

    def all_elements_required?
      @all_elements_required
    end

    def assert_all_touched(message = nil, except: nil, only: nil, &block)
      message = Proc.new(&block) if block_given?

      _elements(map: true).each do |key, elements|
        next if except && except.include?(key) || only && !only.include?(key)

        elements.each do |element|
          untouched = element._untouched

          next unless untouched

          if message.is_a?(Proc)
            message = message.call(Element.new(@context, untouched, self))
          end

          raise Errors::Validation.unexpected_element(@context, message, untouched)
        end
      end
    end

    def element(key = nil)
      _element(key)
    end

    def elements(key = nil)
      @touched = true

      if key
        elements_map = _elements(map: true)
        elements_map.has_key?(key) ? elements_map[key] : []
      else
        _elements
      end
    end

    def empty(key = nil)
      _empty(key)
    end

    def field(key = nil)
      _field(key)
    end

    def fields(key = nil)
      @touched = true

      if key
        elements_map = _elements(map: true)
        elements = elements_map.has_key?(key) ? elements_map[key] : []
      else
        elements = _elements
      end

      elements.map do |element|
        unless element.yields_field?
          raise Errors::Validation.unexpected_element_type(
            @context,
            key,
            element.instruction,
            'expected_fields'
          )
        end

        element.to_field
      end
    end

    def fieldset(key = nil)
      _fieldset(key)
    end

    def fieldsets(key = nil)
      @touched = true

      if key
        elements_map = _elements(map: true)
        elements = elements_map.has_key?(key) ? elements_map[key] : []
      else
        elements = _elements
      end

      elements.map do |element|
        unless element.yields_fieldset?
          raise Errors::Validation.unexpected_element_type(
            @context,
            key,
            element.instruction,
            'expected_fieldsets'
          )
        end

        element.to_fieldset
      end
    end

    def list(key = nil)
      _list(key)
    end

    def lists(key = nil)
      @touched = true

      if key
        elements_map = _elements(map: true)
        elements = elements_map.has_key?(key) ? elements_map[key] : []
      else
        elements = _elements
      end

      elements.map do |element|
        unless element.yields_list?
          raise Errors::Validation.unexpected_element_type(
            @context,
            key,
            element.instruction,
            'expected_lists'
          )
        end

        element.to_list
      end
    end

    def optional_element(key = nil)
      _element(key, required: false)
    end

    def optional_empty(key = nil)
      _empty(key, required: false)
    end

    def optional_field(key = nil)
      _field(key, required: false)
    end

    def optional_fieldset(key = nil)
      _fieldset(key, required: false)
    end

    def optional_list(key = nil)
      _list(key, required: false)
    end

    def optional_section(key = nil)
      _section(key, required: false)
    end

    def parent
      if @instruction[:type] == :document
        nil
      else
        @parent || Section.new(@context, @instruction[:parent])
      end
    end

    def required_element(key = nil)
      _element(key, required: true)
    end

    def required_empty(key = nil)
      _empty(key, required: true)
    end

    def required_field(key = nil)
      _field(key, required: true)
    end

    def required_fieldset(key = nil)
      _fieldset(key, required: true)
    end

    def required_list(key = nil)
      _list(key, required: true)
    end

    def required_section(key = nil)
      _section(key, required: true)
    end

    def section(key = nil)
      _section(key)
    end

    def sections(key = nil)
      @touched = true

      if key
        elements_map = _elements(map: true)
        elements = elements_map.has_key?(key) ? elements_map[key] : []
      else
        elements = _elements
      end

      elements.map do |element|
        unless element.yields_section?
          raise Errors::Validation.unexpected_element_type(
            @context,
            key,
            element.instruction,
            'expected_sections'
          )
        end

        element.to_section
      end
    end

    def to_s
      if @instruction[:type] == :document
        "#<Enolib::Section document elements=#{elements.length}>"
      else
        "#<Enolib::Section key=#{@instruction[:key]} elements=#{elements.length}>"
      end
    end

    def touch
      @touched = true

      _elements.each(&:touch)
    end

    private

    def _element(key = nil, required: nil)
      @touched = true

      if key
        elements_map = _elements(map: true)
        elements = elements_map.has_key?(key) ? elements_map[key] : []
      else
        elements = _elements
      end

      if elements.empty?
        if required || required == nil && @all_elements_required
          raise Errors::Validation.missing_element(@context, key, @instruction, 'missing_element')
        elsif required == nil
          return MissingSectionElement.new(key, self)
        else
          return nil
        end
      end

      if elements.length > 1
        raise Errors::Validation.unexpected_multiple_elements(
          @context,
          key,
          elements.map(&:instruction),
          'expected_single_element'
        )
      end

      elements[0]
    end

    def _elements(map: false)
      unless instance_variable_defined?(:@instantiated_elements)
        @instantiated_elements = []
        @instantiated_elements_map = {}
        instantiate_elements(@instruction)
      end

      map ? @instantiated_elements_map : @instantiated_elements
    end

    def _empty(key = nil, required: nil)
      @touched = true

      if key
        elements_map = _elements(map: true)
        elements = elements_map.has_key?(key) ? elements_map[key] : []
      else
        elements = _elements
      end

      if elements.empty?
        if required || required == nil && @all_elements_required
          raise Errors::Validation.missing_element(@context, key, @instruction, 'missing_empty')
        elsif required == nil
          return MissingEmpty.new(key, self)
        else
          return nil
        end
      end

      if elements.length > 1
        raise Errors::Validation.unexpected_multiple_elements(
          @context,
          key,
          elements.map(&:instruction),
          'expected_single_empty'
        )
      end

      element = elements[0]

      # TODO: Other implementations use a direct check here (['type'] == :foo)
      #       Should this be unified across implementations? Follow up.
      #       (guess is that the main reason is stricter visibility in ruby currently)
      unless element.yields_empty?
        raise Errors::Validation.unexpected_element_type(
          @context,
          key,
          element.instruction,
          'expected_empty'
        )
      end

      element.to_empty
    end

    def _field(key = nil, required: nil)
      @touched = true

      if key
        elements_map = _elements(map: true)
        elements = elements_map.has_key?(key) ? elements_map[key] : []
      else
        elements = _elements
      end

      if elements.empty?
        if required || required == nil && @all_elements_required
          raise Errors::Validation.missing_element(@context, key, @instruction, 'missing_field')
        elsif required == nil
          return MissingField.new(key, self)
        else
          return nil
        end
      end

      if elements.length > 1
        raise Errors::Validation.unexpected_multiple_elements(
          @context,
          key,
          elements.map(&:instruction),
          'expected_single_field'
        )
      end

      element = elements[0]

      unless element.yields_field?
        raise Errors::Validation.unexpected_element_type(
          @context,
          key,
          element.instruction,
          'expected_field'
        )
      end

      element.to_field
    end

    def _fieldset(key = nil, required: nil)
      @touched = true

      if key
        elements_map = _elements(map: true)
        elements = elements_map.has_key?(key) ? elements_map[key] : []
      else
        elements = _elements
      end

      if elements.empty?
        if required || required == nil && @all_elements_required
          raise Errors::Validation.missing_element(@context, key, @instruction, 'missing_fieldset')
        elsif required == nil
          return MissingFieldset.new(key, self)
        else
          return nil
        end
      end

      if elements.length > 1
        raise Errors::Validation.unexpected_multiple_elements(
          @context,
          key,
          elements.map(&:instruction),
          'expected_single_fieldset'
        )
      end

      element = elements[0]

      unless element.yields_fieldset?
        raise Errors::Validation.unexpected_element_type(
          @context,
          key,
          element.instruction,
          'expected_fieldset'
        )
      end

      element.to_fieldset
    end

    def instantiate_elements(section)
      filtered = section[:elements].reject { |element| @instantiated_elements_map.has_key?(element[:key]) }
      instantiated = filtered.map do |element|
        instance = SectionElement.new(@context, element, self)

        if @instantiated_elements_map.has_key?(element[:key])
          @instantiated_elements_map[element[:key]].push(instance)
        else
          @instantiated_elements_map[element[:key]] = [instance]
        end

        instance
      end

      @instantiated_elements.concat(instantiated)
    end

    def _list(key = nil, required: nil)
      @touched = true

      if key
        elements_map = _elements(map: true)
        elements = elements_map.has_key?(key) ? elements_map[key] : []
      else
        elements = _elements
      end

      if elements.empty?
        if required || required == nil && @all_elements_required
          raise Errors::Validation.missing_element(@context, key, @instruction, 'missing_list')
        elsif required == nil
          return MissingList.new(key, self)
        else
          return nil
        end
      end

      if elements.length > 1
        raise Errors::Validation.unexpected_multiple_elements(
          @context,
          key,
          elements.map(&:instruction),
          'expected_single_list'
        )
      end

      element = elements[0]

      unless element.yields_list?
        raise Errors::Validation.unexpected_element_type(
          @context,
          key,
          element.instruction,
          'expected_list'
        )
      end

      element.to_list
    end

    def _section(key = nil, required: nil)
      @touched = true

      if key
        elements_map = _elements(map: true)
        elements = elements_map.has_key?(key) ? elements_map[key] : []
      else
        elements = _elements
      end

      if elements.empty?
        if required || required == nil && @all_elements_required
          raise Errors::Validation.missing_element(@context, key, @instruction, 'missing_section')
        elsif required == nil
          return MissingSection.new(key, self)
        else
          return nil
        end
      end

      if elements.length > 1
        raise Errors::Validation.unexpected_multiple_elements(
          @context,
          key,
          elements.map(&:instruction),
          'expected_single_section'
        )
      end

      element = elements[0]

      unless element.yields_section?
        raise Errors::Validation.unexpected_element_type(
          @context,
          key,
          element.instruction,
          'expected_section'
        )
      end

      element.to_section
    end
  end
end
