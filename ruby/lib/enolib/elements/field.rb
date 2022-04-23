# frozen_string_literal: true

module Enolib
  class Field < ValueElementBase
    attr_reader :instruction, :touched
    
    def initialize(context, instruction, parent = nil)
      super(context, instruction, parent)

      @all_attributes_required = parent ? parent.all_elements_required? : false
    end
    
    def _missing_error(attribute)
      raise Errors::Validation.missing_element(@context, attribute.key, @instruction, 'missing_attribute')
    end
    
    def _untouched
      return @instruction unless instance_variable_defined?(:@touched)

      if @instruction.has_key?(:attributes)
        untouched_attribute = _attributes.find { |attribute| !attribute.instance_variable_defined?(:@touched) }
        return untouched_attribute.instruction if untouched_attribute
      elsif @instruction.has_key?(:items)
        untouched_item = _items.find { |item| !item.instance_variable_defined?(:@touched) }
        return untouched_item.instruction if untouched_item
      end
      
      false
    end
    
    def all_attributes_required(required = true)
      @all_attributes_required = required
    end
    
    def assert_all_touched(message = nil, except: nil, only: nil, &block)
      message = Proc.new(&block) if block_given?

      _attributes(map: true).each do |key, attributes|
        next if except && except.include?(key) || only && !only.include?(key)

        attributes.each do |attribute|
          next if attribute.touched  # TODO: Revisit instance var existance question in ruby

          if message.is_a?(Proc)
            message = message.call(attribute)
          end

          raise Errors::Validation.unexpected_element(@context, message, attribute[:instruction])
        end
      end
    end
    
    def attribute(key = nil)
      _attribute(key)
    end
    
    def attributes(key = nil)
      @touched = true

      if key
        attributes_map = _attributes(map: true)
        attributes_map.has_key?(key) ? attributes_map[key] : []
      else
        _attributes
      end
    end
    
    def items
      @touched = true

      _items
    end

    def length
      @touched = true

      _items.length
    end
    
    def optional_attribute(key)
      _attribute(key, required: false)
    end
    
    def optional_comment(loader = nil, &block)
      loader = Proc.new(&block) if block_given?

      if loader
        _comment(loader, required: false)
      else
        raise ArgumentError, 'A loader block or Proc must be provided'
      end
    end
    
    def optional_string_value
      _value(required: false)
    end
    
    def optional_string_values
      @touched = true

      _items.map(&:optional_string_value)
    end

    def optional_value(loader = nil, &block)
      loader = Proc.new(&block) if block_given?

      unless loader
        raise ArgumentError, 'A loader function must be provided'
      end

      _value(loader, required: false)
    end
    
    def optional_values(loader = nil, &block)
      loader = Proc.new(&block) if block_given?

      @touched = true

      unless loader
        raise ArgumentError, 'A loader function must be provided'
      end

      _items.map { |item| item.optional_value(loader) }
    end

    def parent
      @parent || Section.new(@context, @instruction[:parent])
    end
    
    def required_attribute(key = nil)
      _attribute(key, required: true)
    end

    def required_string_value
      _value(required: true)
    end
    
    def required_string_values
      @touched = true

      _items.map(&:required_string_value)
    end

    def required_value(loader = nil, &block)
      loader = Proc.new(&block) if block_given?

      unless loader
        raise ArgumentError, 'A loader function must be provided'
      end

      _value(loader, required: true)
    end

    def required_values(loader = nil, &block)
      loader = Proc.new(&block) if block_given?

      @touched = true

      unless loader
        raise ArgumentError, 'A loader function must be provided'
      end

      _items.map { |item| item.required_value(loader) }
    end

    def to_s
      if @instruction.has_key?(:attributes)
        "#<Enolib::Field key=#{@instruction[:key]} attributes=#{_attributes.length}>"
      elsif @instruction.has_key?(:items)
        "#<Enolib::Field key=#{@instruction[:key]} items=#{_items.length}>"
      elsif @instruction.has_key?(:continuations) || @instruction.has_key?(:value)
        "#<Enolib::Field key=#{@instruction[:key]} value=#{print_value}>"
      else
        "#<Enolib::Field key=#{@instruction[:key]}>"
      end
    end
    
    def touch
      @touched = true
      
      if @instruction.has_key?(:attributes)
        _attributes.each(&:touch)
      elsif @instruction.has_key?(:items)
        _items.each(&:touch)
      end
    end
    
    private
    
    def _attribute(key = nil, required: nil)
      @touched = true

      if key
        attributes_map = _attributes(map: true)
        attributes = attributes_map.has_key?(key) ? attributes_map[key] : []
      else
        attributes = _attributes
      end

      if attributes.empty?
        if required || required == nil && @all_attributes_required
          raise Errors::Validation.missing_element(@context, key, @instruction, 'missing_attribute')
        elsif required == nil
          return MissingAttribute.new(key, self)
        else
          return nil
        end
      end

      if attributes.length > 1
        raise Errors::Validation.unexpected_multiple_elements(
          @context,
          key,
          attributes.map(&:instruction),
          'expected_single_attribute'
        )
      end

      attributes[0]
    end
    
    def _attributes(map: false)
      unless instance_variable_defined?(:@instantiated_attributes)
        @instantiated_attributes_map = {}
        if @instruction.has_key?(:attributes)
          @instantiated_attributes = @instruction[:attributes].map do |attribute|
            instance = Attribute.new(@context, attribute, self)

            if @instantiated_attributes_map.has_key?(attribute[:key])
              @instantiated_attributes_map[attribute[:key]].push(instance)
            else
              @instantiated_attributes_map[attribute[:key]] = [instance]
            end

            instance
          end
        else
          @instantiated_attributes = []
        end
      end

      map ? @instantiated_attributes_map : @instantiated_attributes
    end
    
    def _items
      unless instance_variable_defined?(:@instantiated_items)
        @instantiated_items =
          if @instruction.has_key?(:items)
            @instruction[:items].map { |item| Item.new(@context, item, self) }
          else
            []
          end
      end

      @instantiated_items
    end
  end
end
