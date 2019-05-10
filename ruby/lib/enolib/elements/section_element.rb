# frozen_string_literal: true

module Enolib
  class SectionElement < ElementBase
    attr_reader :instruction # TODO: Revisit this hacky exposition

    def _untouched
      return @instruction unless instance_variable_defined?(:@yielded)

      return @instruction if instance_variable_defined?(:@empty) && !@empty.instance_variable_defined?(:@touched)
      return @instruction if instance_variable_defined?(:@field) && !@field.instance_variable_defined?(:@touched)
      return @fieldset._untouched if instance_variable_defined?(:@fieldset)
      return @list._untouched if instance_variable_defined?(:@list)
      return @section._untouched if instance_variable_defined?(:@section)
    end

    def to_empty
      unless instance_variable_defined?(:@empty)
        if instance_variable_defined?(:@yielded)
          raise TypeError, "This element was already yielded as #{PRETTY_TYPES[@yielded]} and can't be yielded again as an empty."
        end

        unless @instruction[:type] == :empty_element
          # TODO: Below and in all implementations - why nil for key as second parameter?
          raise Errors::Validation.unexpected_element_type(@context, nil, @instruction, 'expected_empty')
        end

        @empty = Empty.new(@context, @instruction, @parent)
        @yielded = :empty_element
      end

      @empty
    end

    def to_field
      unless instance_variable_defined?(:@field)
        if instance_variable_defined?(:@yielded)
          raise TypeError, "This element was already yielded as #{PRETTY_TYPES[@yielded]} and can't be yielded again as a field."
        end

        unless @instruction[:type] == :field ||
               @instruction[:type] == :multiline_field_begin ||
               @instruction[:type] == :empty_element
          raise Errors::Validation.unexpected_element_type(@context, nil, @instruction, 'expected_field')
        end

        @field = Field.new(@context, @instruction, @parent)
        @yielded = :field
      end

      @field
    end

    def to_fieldset
      unless instance_variable_defined?(:@fieldset)
        if instance_variable_defined?(:@yielded)
          raise TypeError, "This element was already yielded as #{PRETTY_TYPES[@yielded]} and can't be yielded again as a fieldset."
        end

        unless @instruction[:type] == :fieldset || @instruction[:type] == :empty_element
          raise Errors::Validation.unexpected_element_type(@context, nil, @instruction, 'expected_fieldset')
        end

        @fieldset = Fieldset.new(@context, @instruction, @parent)
        @yielded = :fieldset
      end

      @fieldset
    end

    def to_list
      unless instance_variable_defined?(:@list)
        if instance_variable_defined?(:@yielded)
          raise TypeError, "This element was already yielded as #{PRETTY_TYPES[@yielded]} and can't be yielded again as a list."
        end

        unless @instruction[:type] == :list || @instruction[:type] == :empty_element
          raise Errors::Validation.unexpected_element_type(@context, nil, @instruction, 'expected_list')
        end

        @list = List.new(@context, @instruction, @parent)
        @yielded = :list
      end

      @list
    end

    def to_section
      unless instance_variable_defined?(:@section)
        unless @instruction[:type] == :section
          raise Errors::Validation.unexpected_element_type(@context, nil, @instruction, 'expected_section')
        end

        @section = Section.new(@context, @instruction, @parent)
        @yielded = :section
      end

      @section
    end

    def touch
      # TODO: Here and other implementations: This needs to touch anyway; possibly not so small implications
      return unless instance_variable_defined?(:@yielded)

      # TODO: Revisit setting touched on foreign instances
      @empty.touched = true if instance_variable_defined?(:@empty)
      @field.touched = true if instance_variable_defined?(:@field)
      @fieldset.touch if instance_variable_defined?(:@fieldset)
      @list.touch if instance_variable_defined?(:@list)
      @section.touch if instance_variable_defined?(:@section)
    end

    def yields_empty?
      @instruction[:type] == :empty_element
    end

    def yields_field?
      @instruction[:type] == :field ||
      @instruction[:type] == :multiline_field_begin ||
      @instruction[:type] == :empty_element
    end

    def yields_fieldset?
      @instruction[:type] == :fieldset ||
      @instruction[:type] == :empty_element
    end

    def yields_list?
      @instruction[:type] == :list ||
      @instruction[:type] == :empty_element
    end

    def yields_section?
      @instruction[:type] == :section
    end

    def to_s
      "#<Enolib::SectionElement key=#{@instruction[:key]}>"
    end
  end
end
