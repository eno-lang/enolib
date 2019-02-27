# frozen_string_literal: true

module Enolib
  class Context
    attr_accessor :document, :input, :line_count, :messages, :meta, :reporter, :source

    def initialize(input, locale: Messages::En, reporter: TextReporter, source: nil)
      @input = input
      @messages = locale
      @reporter = reporter
      @source = source

      @document = {
        elements: [],
        type: :document
      }

      @meta = []

      Parser.new(self).run
    end

    def comment(element)
      unless element.has_key?(:computed_comment)
        element[:computed_comment] =
          if !element.has_key?(:comments)
            nil
          elsif element[:comments].length == 1
            element[:comments].first[:comment]
          else
            first_non_empty_line_index = nil
            last_non_empty_line_index = nil
            shared_indent = Float::INFINITY

            element[:comments].each_with_index do |comment, index|
              if comment.has_key?(:comment)
                first_non_empty_line_index = index unless first_non_empty_line_index
                last_non_empty_line_index = index

                indent = comment[:ranges][:comment][RANGE_BEGIN] - comment[:ranges][:line][RANGE_BEGIN]
                shared_indent = indent if indent < shared_indent
              end
            end

            if first_non_empty_line_index
                non_empty_lines = element[:comments][first_non_empty_line_index..last_non_empty_line_index]

                non_empty_lines.map do |comment|
                  if !comment.has_key?(:comment)
                    ''
                  elsif (comment[:ranges][:comment][RANGE_BEGIN] - comment[:ranges][:line][RANGE_BEGIN]) == shared_indent
                    comment[:comment]
                  else
                    (' ' * (comment[:ranges][:comment][RANGE_BEGIN] - comment[:ranges][:line][RANGE_BEGIN] - shared_indent)) + comment[:comment]
                  end
                end.join("\n")
            else
              nil
            end
          end
      end

      element[:computed_comment]
    end

    def elements(section)
      return elements(section[:mirror]) if section.has_key?(:mirror)

      unless section.has_key?(:computed_elements)
        section[:computed_elements] = section[:elements]
        section[:computed_elements_map] = {}

        section[:computed_elements].each do |element|
          if section[:computed_elements_map].has_key?(element[:key])
            section[:computed_elements_map][element[:key]].push(element)
          else
            section[:computed_elements_map][element[:key]] = [element]
          end
        end

        if section.has_key?(:extend)
          copied_elements = elements(section[:extend]).reject { |element| section[:computed_elements_map].has_key?(element[:key]) }

          section[:computed_elements] = copied_elements + section[:computed_elements]

          copied_elements.each do |element|
            if section[:computed_elements_map].has_key?(element[:key])
              section[:computed_elements_map][element[:key]].push(element)
            else
              section[:computed_elements_map][element[:key]] = [element]
            end
          end
        end
      end

      section[:computed_elements]
    end

    def entries(fieldset)
      return entries(fieldset[:mirror]) if fieldset.has_key?(:mirror)

      unless fieldset.has_key?(:computed_entries)
        fieldset[:computed_entries] = fieldset[:entries]
        fieldset[:computed_entries_map] = {}

        fieldset[:computed_entries].each do |entry|
          if fieldset[:computed_entries_map].has_key?(entry[:key])
            fieldset[:computed_entries_map][entry[:key]].push(entry)
          else
            fieldset[:computed_entries_map][entry[:key]] = [entry]
          end
        end

        if fieldset.has_key?(:extend)
          copied_entries = entries(fieldset[:extend]).reject { |entry| fieldset[:computed_entries_map].has_key?(entry[:key]) }

          fieldset[:computed_entries] = copied_entries + fieldset[:computed_entries]

          copied_entries.each do |entry|
            if fieldset[:computed_entries_map].has_key?(entry[:key])
              fieldset[:computed_entries_map][entry[:key]].push(entry)
            else
              fieldset[:computed_entries_map][entry[:key]] = [entry]
            end
          end
        end
      end

      fieldset[:computed_entries]
    end

    def items(list)
      if list.has_key?(:mirror)
        items(list[:mirror])
      elsif list.has_key?(:extend)
        items(list[:extend]) + list[:items]
      elsif list.has_key?(:items)
        list[:items]
      else
        []
      end
    end

    def raw(element)
      # TODO: In other implementations there is only one 'field' type
      #       here we get a) symbols, b) including :multiline_field_begin
      result = { type: element[:type] }

      # TODO: Revisit to think through the case of a present but empty comment
      result[:comment] = comment(element) if element.has_key?(:comments)

      case element[:type]
      when :empty_element
        result[:key] = element[:key]
      when :field
        result[:key] = element[:key]
        result[:value] = value(element)
      when :list_item
        result[:value] = value(element)
      when :fieldset_entry
        result[:key] = element[:key]
        result[:value] = value(element)
      when :multiline_field_begin
        result[:key] = element[:key]
        result[:value] = value(element)
      when :list
        result[:key] = element[:key]
        result[:items] = items(element).map { |item| raw(item) }
      when :fieldset
        result[:key] = element[:key]
        result[:entries] = entries(element).map { |entry| raw(entry) }
      when :section
        result[:key] = element[:key]
        result[:elements] = elements(element).map { |section_element| raw(section_element) }
      when :document
        result[:elements] = elements(element).map { |section_element| raw(section_element) }
      end

      result
    end

    def value(element)
      unless element.has_key?(:computed_value)
        return value(element[:mirror]) if element.has_key?(:mirror)

        element[:computed_value] = nil

        if element[:type] == :multiline_field_begin
          if element.has_key?(:lines)
            element[:computed_value] = @input[
              element[:lines][0][:ranges][:line][0]...element[:lines][-1][:ranges][:line][1]
            ]
          end
        else
          element[:computed_value] = element[:value] if element.has_key?(:value)

          if element.has_key?(:continuations)
            unapplied_spacing = nil

            element[:continuations].each do |continuation|
              if element[:computed_value] == nil
                element[:computed_value] = continuation[:value] if continuation.has_key?(:value)
                unapplied_spacing = nil
              elsif !continuation.has_key?(:value)
                unapplied_spacing ||= continuation.has_key?(:spaced)
              elsif continuation.has_key?(:spaced) || unapplied_spacing
                element[:computed_value] += ' ' + continuation[:value]
                unapplied_spacing = nil
              else
                element[:computed_value] += continuation[:value]
              end
            end
          end
        end
      end

      return element[:computed_value]
    end
  end
end
