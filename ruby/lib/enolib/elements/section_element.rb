# frozen_string_literal: true

module Enolib
  class SectionElement < ElementBase
    attr_reader :instruction # TODO: Revisit this hacky exposition

    def _untouched
      unless instance_variable_defined?(:@yielded)
        return instance_variable_defined?(:@touched) ? false : @instruction
      end

      return @instruction if instance_variable_defined?(:@empty) && !@empty.instance_variable_defined?(:@touched)
      return @instruction if instance_variable_defined?(:@field) && !@field.instance_variable_defined?(:@touched)
      return @fieldset._untouched if instance_variable_defined?(:@fieldset)
      return @list._untouched if instance_variable_defined?(:@list)
      return @section._untouched if instance_variable_defined?(:@section)
    end

    def to_empty
      unless instance_variable_defined?(:@empty)
        unless @instruction[:type] == :empty
          # TODO: Below and in all implementations - why nil for key as second parameter?
          raise Errors::Validation.unexpected_element_type(@context, nil, @instruction, 'expected_empty')
        end

        @empty = Empty.new(@context, @instruction, @parent)
        @yielded = :empty
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
               @instruction[:type] == :field_or_fieldset_or_list
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

        unless @instruction[:type] == :fieldset || @instruction[:type] == :field_or_fieldset_or_list
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

        unless @instruction[:type] == :list || @instruction[:type] == :field_or_fieldset_or_list
          raise Errors::Validation.unexpected_element_type(@context, nil, @instruction, 'expected_list')
        end

        @list = List.new(@context, @instruction, @parent)
        @yielded = :list
      end

      @list
    end

    def to_s
      "#<Enolib::SectionElement key=#{_key} yields=#{_yields}>"
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
      # TODO: Revisit setting touched on foreign instances
      if !instance_variable_defined?(:@yielded)
        @touched = true
      elsif instance_variable_defined?(:@empty)
        @empty.touched = true
      elsif instance_variable_defined?(:@field)
        @field.touched = true
      elsif instance_variable_defined?(:@fieldset)
        @fieldset.touch
      elsif instance_variable_defined?(:@list)
        @list.touch
      elsif instance_variable_defined?(:@section)
        @section.touch
      end
    end

    def yields_empty?
      @instruction[:type] == :empty
    end

    def yields_field?
      @instruction[:type] == :field ||
      @instruction[:type] == :multiline_field_begin ||
      @instruction[:type] == :field_or_fieldset_or_list
    end

    def yields_fieldset?
      @instruction[:type] == :fieldset ||
      @instruction[:type] == :field_or_fieldset_or_list
    end

    def yields_list?
      @instruction[:type] == :list ||
      @instruction[:type] == :field_or_fieldset_or_list
    end

    def yields_section?
      @instruction[:type] == :section
    end

    private

    def _yields
      if @instruction[:type] == :field_or_fieldset_or_list
          return "#{PRETTY_TYPES[:field]},#{PRETTY_TYPES[:fieldset]},#{PRETTY_TYPES[:list]}"
      end

      PRETTY_TYPES[@instruction[:type]]
    end
  end
end
