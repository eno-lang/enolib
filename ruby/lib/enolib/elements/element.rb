# frozen_string_literal: true

module Enolib
  class Element < SectionElement
    def to_document
      unless @instruction[:type] == :document
        raise Errors::Validation.unexpected_element_type(@context, nil, @instruction, 'expected_document')
      end

      unless instance_variable_defined?(:@section)
        @section = Section.new(@context, @instruction)
        @yielded = :section
      end

      @section
    end

    def to_fieldset_entry
      unless instance_variable_defined?(:@fieldset_entry)
        unless @instruction[:type] == :fieldset_entry
          # TODO: Below and in all implementations - why nil for key as second parameter?
          raise Errors::Validation.unexpected_element_type(@context, nil, @instruction, 'expected_fieldset_entry')
        end

        @fieldset_entry = FieldsetEntry.new(@context, @instruction)
      end

      @fieldset_entry
    end

    def to_list_item
      unless instance_variable_defined?(:@list_item)
        unless @instruction[:type] == :list_item
          raise Errors::Validation.unexpected_element_type(@context, nil, @instruction, 'expected_list_item')
        end

        @list_item = FieldsetEntry.new(@context, @instruction)
      end

      @list_item
    end

    def to_section
      unless instance_variable_defined?(:@section)
        unless @instruction[:type] == :section || @instruction[:type] == :document
          raise Errors::Validation.unexpected_element_type(@context, nil, @instruction, 'expected_section')
        end

        @section = Section.new(@context, @instruction)
        @yielded = :section
      end

      @section
    end

    def to_s
      "#<Enolib::Element key=#{@instruction[:key]}>"
    end

    def yields_fieldset_entry?
      @instruction[:type] == :fieldset_entry
    end

    def yields_list_item?
      @instruction[:type] == :list_item
    end

    def yields_section?
      @instruction[:type] == :section ||
      @instruction[:type] == :document
    end
  end
end
