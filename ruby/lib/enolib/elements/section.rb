# frozen_string_literal: true

module Enolib
  class Section < ElementBase
    attr_reader :instruction
    
    def initialize(context, instruction, parent = nil)
      super(context, instruction, parent)

      @all_elements_required = parent ? parent.all_elements_required? : false
    end

    def _missing_error(element)
      case element
      when MissingEmbed
        raise Errors::Validation.missing_element(@context, element.instance_variable_get(:@key), @instruction, 'missing_embed')
      when MissingField
        raise Errors::Validation.missing_element(@context, element.instance_variable_get(:@key), @instruction, 'missing_field')
      when MissingFlag
        raise Errors::Validation.missing_element(@context, element.instance_variable_get(:@key), @instruction, 'missing_flag')
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
        if element.instruction[:type] == :section
          element.all_elements_required(required)
        elsif element.instruction[:type] == :field
          element.all_attributes_required(required)
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
    
    def embed(key = nil)
      _embed(key)
    end
    
    def embeds(key = nil)
      @touched = true

      if key
        elements_map = _elements(map: true)
        elements = elements_map.has_key?(key) ? elements_map[key] : []
      else
        elements = _elements
      end

      elements.each do |element|
        next if element.is_a?(Embed)
        raise Errors::Validation.unexpected_element_type(@context, key, element.instruction, 'expected_embeds')
      end
      
      elements
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

      elements.each do |element|
        next if element.is_a?(Field)
        raise Errors::Validation.unexpected_element_type(@context, key, element.instruction, 'expected_fields')
      end
      
      elements
    end
    
    def flag(key = nil)
      _flag(key)
    end
    
    def flags(key = nil)
      @touched = true

      if key
        elements_map = _elements(map: true)
        elements = elements_map.has_key?(key) ? elements_map[key] : []
      else
        elements = _elements
      end

      elements.each do |element|
        next if element.is_a?(Flag)
        raise Errors::Validation.unexpected_element_type(@context, key, element.instruction, 'expected_flags')
      end
      
      elements
    end

    def optional_element(key = nil)
      _element(key, required: false)
    end

    def optional_embed(key = nil)
      _embed(key, required: false)
    end

    def optional_field(key = nil)
      _field(key, required: false)
    end

    def optional_flag(key = nil)
      _flag(key, required: false)
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

    def required_embed(key = nil)
      _embed(key, required: true)
    end

    def required_field(key = nil)
      _field(key, required: true)
    end
    
    def required_flag(key = nil)
      _flag(key, required: true)
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

      elements.each do |element|
        next if element.is_a?(Section)
        raise Errors::Validation.unexpected_element_type(@context, key, element.instruction, 'expected_sections')
      end
      
      elements
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
          @context, key, elements.map(&:instruction), 'expected_single_element'
        )
      end

      elements[0]
    end

    def _elements(map: false)
      unless instance_variable_defined?(:@instantiated_elements)
        @instantiated_elements_map = {}
        @instantiated_elements = @instruction[:elements].map do |element|
          instance =
            case element[:type]
            when :embed_begin then Embed.new(@context, element, self)
            when :field then Field.new(@context, element, self)
            when :flag then Flag.new(@context, element, self)
            when :section then Section.new(@context, element, self)
            end

          if @instantiated_elements_map.has_key?(element[:key])
            @instantiated_elements_map[element[:key]].push(instance)
          else
            @instantiated_elements_map[element[:key]] = [instance]
          end

          instance
        end
      end

      map ? @instantiated_elements_map : @instantiated_elements
    end

    def _embed(key = nil, required: nil)
      @touched = true

      if key
        elements_map = _elements(map: true)
        elements = elements_map.has_key?(key) ? elements_map[key] : []
      else
        elements = _elements
      end

      if elements.empty?
        if required || required == nil && @all_elements_required
          raise Errors::Validation.missing_element(@context, key, @instruction, 'missing_embed')
        elsif required == nil
          return MissingEmbed.new(key, self)
        else
          return nil
        end
      end

      if elements.length > 1
        raise Errors::Validation.unexpected_multiple_elements(
          @context, key, elements.map(&:instruction), 'expected_single_embed'
        )
      end

      element = elements[0]

      unless element.is_a?(Embed)
        raise Errors::Validation.unexpected_element_type(
          @context, key, element.instruction, 'expected_embed'
        )
      end

      element
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
          @context, key, elements.map(&:instruction), 'expected_single_field'
        )
      end

      element = elements[0]

      unless element.is_a?(Field)
        raise Errors::Validation.unexpected_element_type(
          @context, key, element.instruction, 'expected_field'
        )
      end

      element
    end
    
    def _flag(key = nil, required: nil)
      @touched = true

      if key
        elements_map = _elements(map: true)
        elements = elements_map.has_key?(key) ? elements_map[key] : []
      else
        elements = _elements
      end

      if elements.empty?
        if required || required == nil && @all_elements_required
          raise Errors::Validation.missing_element(@context, key, @instruction, 'missing_flag')
        elsif required == nil
          return MissingFlag.new(key, self)
        else
          return nil
        end
      end

      if elements.length > 1
        raise Errors::Validation.unexpected_multiple_elements(
          @context, key, elements.map(&:instruction), 'expected_single_flag'
        )
      end

      element = elements[0]

      unless element.is_a?(Flag)
        raise Errors::Validation.unexpected_element_type(
          @context, key, element.instruction, 'expected_flag'
        )
      end

      element
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
          @context, key, elements.map(&:instruction), 'expected_single_section'
        )
      end

      element = elements[0]

      unless element.is_a?(Section)
        raise Errors::Validation.unexpected_element_type(
          @context, key, element.instruction, 'expected_section'
        )
      end

      element
    end
  end
end
