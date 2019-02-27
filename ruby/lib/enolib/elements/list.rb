# frozen_string_literal: true

module Enolib
  class List < ElementBase
    attr_reader :instruction

    def _instantiate_items(list)
      if list.has_key?(:mirror)
        _instantiate_items(list[:mirror])
      elsif list.has_key?(:extend)
        _instantiate_items(list[:extend]) + list[:items].map { |item| ListItem.new(@context, item, self) }
      elsif list.has_key?(:items)
        list[:items].map { |item| ListItem.new(@context, item, self) }
      else
        []
      end
    end

    def _items
      unless instance_variable_defined?(:@instantiated_items)
        @instantiated_items = _instantiate_items(@instruction)
      end

      @instantiated_items
    end

    def _untouched
      return @instruction unless instance_variable_defined?(:@touched)

      untouched_item = _items.find { |item| !item.instance_variable_defined?(:@touched) }

      untouched_item ? untouched_item.instruction : false
    end

    def items
      @touched = true

      _items
    end

    def length
      @touched = true

      _items.length
    end

    def optional_comment(loader = nil)
      loader = Proc.new if block_given?

      if loader
        _comment(loader, required: false)
      else
        raise ArgumentError.new('A loader block or Proc must be provided')
      end
    end

    def optional_string_values
      @touched = true

      _items.map(&:optional_string_value)
    end

    def optional_values(loader = nil)
      loader = Proc.new if block_given?

      @touched = true

      unless loader
        raise ArgumentError.new('A loader function must be provided')
      end

      _items.map { |item| item.optional_value(loader) }
    end

    def parent
      @parent || Section.new(@context, @instruction[:parent])
    end

    def required_string_values
      @touched = true

      _items.map(&:required_string_value)
    end

    def required_values(loader = nil)
      loader = Proc.new if block_given?

      @touched = true

      unless loader
        raise ArgumentError.new('A loader function must be provided')
      end

      _items.map { |item| item.required_value(loader) }
    end

    def to_s
      "#<Enolib::List key=#{@instruction[:key]} items=#{_items.length}>"
    end

    def touch
      @touched = true

      _items.each(&:touch)
    end
  end
end
