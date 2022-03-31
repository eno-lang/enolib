# frozen_string_literal: true

module Enolib
  class Parser
    def initialize(context)
      @context = context
      @depth = 0
      @index = 0
      @line = 0
    end

    def run
      if @context.input.empty?
        @context.line_count = 1
        return
      end

      comments = nil
      last_continuable_element = nil
      last_non_section_element = nil
      last_section = @context.document

      while @index < @context.input.length
        match = Grammar::REGEX.match(@context.input, @index)

        unless match && match.begin(0) == @index
          instruction = parse_after_error
          raise Errors::Parsing.invalid_line(@context, instruction)
        end

        instruction = {
          index: @index,
          line: @line,
          ranges: {
            line: match.offset(0)
          }
        }

        multiline_field = false

        if match[Grammar::EMPTY_LINE_INDEX]

          if comments
            @context.meta.concat(comments)
            comments = nil
          end

        elsif match[Grammar::ELEMENT_OPERATOR_INDEX]

          if comments
            instruction[:comments] = comments
            comments = nil
          end

          instruction[:key] = match[Grammar::KEY_UNESCAPED_INDEX]

          if instruction[:key]
            instruction[:ranges][:element_operator] = match.offset(Grammar::ELEMENT_OPERATOR_INDEX)
            instruction[:ranges][:key] = match.offset(Grammar::KEY_UNESCAPED_INDEX)
          else
            instruction[:key] = match[Grammar::KEY_ESCAPED_INDEX]
            instruction[:ranges][:element_operator] = match.offset(Grammar::ELEMENT_OPERATOR_INDEX)
            instruction[:ranges][:escape_begin_operator] = match.offset(Grammar::KEY_ESCAPE_BEGIN_OPERATOR_INDEX)
            instruction[:ranges][:escape_end_operator] = match.offset(Grammar::KEY_ESCAPE_END_OPERATOR_INDEX)
            instruction[:ranges][:key] = match.offset(Grammar::KEY_ESCAPED_INDEX)
          end

          value = match[Grammar::FIELD_VALUE_INDEX]

          if value
            instruction[:ranges][:value] = match.offset(Grammar::FIELD_VALUE_INDEX)
            instruction[:type] = :field
            instruction[:value] = value
          else
            instruction[:type] = :field_or_fieldset_or_list
          end

          instruction[:parent] = last_section
          last_section[:elements].push(instruction)
          last_continuable_element = instruction
          last_non_section_element = instruction

        elsif match[Grammar::LIST_ITEM_OPERATOR_INDEX]

          if comments
            instruction[:comments] = comments
            comments = nil
          end

          instruction[:ranges][:item_operator] = match.offset(Grammar::LIST_ITEM_OPERATOR_INDEX)
          instruction[:type] = :list_item

          value = match[Grammar::LIST_ITEM_VALUE_INDEX]

          if value
            instruction[:ranges][:value] = match.offset(Grammar::LIST_ITEM_VALUE_INDEX)
            instruction[:value] = value
          end

          if !last_non_section_element
            parse_after_error(instruction)
            raise Errors::Parsing.missing_list_for_list_item(@context, instruction)
          elsif last_non_section_element[:type] == :list
            last_non_section_element[:items].push(instruction)
          elsif last_non_section_element[:type] == :field_or_fieldset_or_list
            last_non_section_element[:items] = [instruction]
            last_non_section_element[:type] = :list
          else
            parse_after_error(instruction)
            raise Errors::Parsing.missing_list_for_list_item(@context, instruction)
          end

          instruction[:parent] = last_non_section_element
          last_continuable_element = instruction

        elsif match[Grammar::FIELDSET_ENTRY_OPERATOR_INDEX]

          if comments
            instruction[:comments] = comments
            comments = nil
          end

          instruction[:type] = :fieldset_entry

          instruction[:key] = match[Grammar::KEY_UNESCAPED_INDEX]

          if instruction[:key]
            instruction[:ranges][:key] = match.offset(Grammar::KEY_UNESCAPED_INDEX)
            instruction[:ranges][:entry_operator] = match.offset(Grammar::FIELDSET_ENTRY_OPERATOR_INDEX)
          else
            instruction[:key] = match[Grammar::KEY_ESCAPED_INDEX]
            instruction[:ranges][:entry_operator] = match.offset(Grammar::FIELDSET_ENTRY_OPERATOR_INDEX)
            instruction[:ranges][:escape_begin_operator] = match.offset(Grammar::KEY_ESCAPE_BEGIN_OPERATOR_INDEX)
            instruction[:ranges][:escape_end_operator] = match.offset(Grammar::KEY_ESCAPE_END_OPERATOR_INDEX)
            instruction[:ranges][:key] = match.offset(Grammar::KEY_ESCAPED_INDEX)
          end

          value = match[Grammar::FIELDSET_ENTRY_VALUE_INDEX]

          if value
            instruction[:ranges][:value] = match.offset(Grammar::FIELDSET_ENTRY_VALUE_INDEX)
            instruction[:value] = value
          end

          if !last_non_section_element
            parse_after_error(instruction)
            raise Errors::Parsing.missing_fieldset_for_fieldset_entry(@context, instruction)
          elsif last_non_section_element[:type] == :fieldset
            last_non_section_element[:entries].push(instruction)
          elsif last_non_section_element[:type] == :field_or_fieldset_or_list
            last_non_section_element[:entries] = [instruction]
            last_non_section_element[:type] = :fieldset
          else
            parse_after_error(instruction)
            raise Errors::Parsing.missing_fieldset_for_fieldset_entry(@context, instruction)
          end

          instruction[:parent] = last_non_section_element
          last_continuable_element = instruction

        elsif match[Grammar::SPACED_LINE_CONTINUATION_OPERATOR_INDEX]

          instruction[:spaced] = true
          instruction[:ranges][:spaced_line_continuation_operator] = match.offset(Grammar::SPACED_LINE_CONTINUATION_OPERATOR_INDEX)
          instruction[:type] = :continuation

          value = match[Grammar::SPACED_LINE_CONTINUATION_VALUE_INDEX]

          if value
            instruction[:ranges][:value] = match.offset(Grammar::SPACED_LINE_CONTINUATION_VALUE_INDEX)
            instruction[:value] = value
          end

          unless last_continuable_element
            parse_after_error(instruction)
            raise Errors::Parsing.missing_element_for_continuation(@context, instruction)
          end

          if last_continuable_element.has_key?(:continuations)
            last_continuable_element[:continuations].push(instruction)
          else
            if last_continuable_element[:type] == :field_or_fieldset_or_list
              last_continuable_element[:type] = :field
            end

            last_continuable_element[:continuations] = [instruction]
          end

          if comments
            @context.meta.concat(comments)
            comments = nil
          end

        elsif match[Grammar::DIRECT_LINE_CONTINUATION_OPERATOR_INDEX]

          instruction[:ranges][:direct_line_continuation_operator] = match.offset(Grammar::DIRECT_LINE_CONTINUATION_OPERATOR_INDEX)
          instruction[:type] = :continuation

          value = match[Grammar::DIRECT_LINE_CONTINUATION_VALUE_INDEX]

          if value
            instruction[:ranges][:value] = match.offset(Grammar::DIRECT_LINE_CONTINUATION_VALUE_INDEX)
            instruction[:value] = value
          end

          unless last_continuable_element
            parse_after_error(instruction)
            raise Errors::Parsing.missing_element_for_continuation(@context, instruction)
          end

          if last_continuable_element.has_key?(:continuations)
            last_continuable_element[:continuations].push(instruction)
          else
            if last_continuable_element[:type] == :field_or_fieldset_or_list
              last_continuable_element[:type] = :field
            end

            last_continuable_element[:continuations] = [instruction]
          end

          if comments
            @context.meta.concat(comments)
            comments = nil
          end

        elsif match[Grammar::SECTION_OPERATOR_INDEX]

          if comments
            instruction[:comments] = comments
            comments = nil
          end

          instruction[:elements] = []
          instruction[:ranges][:section_operator] = match.offset(Grammar::SECTION_OPERATOR_INDEX)
          instruction[:type] = :section

          instruction[:key] = match[Grammar::SECTION_KEY_INDEX]
          instruction[:ranges][:key] = match.offset(Grammar::SECTION_KEY_INDEX)

          new_depth = instruction[:ranges][:section_operator][1] - instruction[:ranges][:section_operator][0]

          if new_depth == @depth + 1
            instruction[:parent] = last_section
            @depth = new_depth
          elsif new_depth == @depth
            instruction[:parent] = last_section[:parent]
          elsif new_depth < @depth
            while new_depth < @depth
              last_section = last_section[:parent]
              @depth -= 1
            end

            instruction[:parent] = last_section[:parent]
          else
            parse_after_error(instruction)
            raise Errors::Parsing.section_hierarchy_layer_skip(@context, instruction, last_section)
          end

          instruction[:parent][:elements].push(instruction)

          last_section = instruction
          last_continuable_element = nil
          last_non_section_element = nil

        elsif match[Grammar::MULTILINE_FIELD_OPERATOR_INDEX]

          if comments
            instruction[:comments] = comments
            comments = nil
          end

          operator = match[Grammar::MULTILINE_FIELD_OPERATOR_INDEX]
          key = match[Grammar::MULTILINE_FIELD_KEY_INDEX]

          instruction[:key] = key
          instruction[:parent] = last_section
          instruction[:ranges][:multiline_field_operator] = match.offset(Grammar::MULTILINE_FIELD_OPERATOR_INDEX)
          instruction[:ranges][:key] = match.offset(Grammar::MULTILINE_FIELD_KEY_INDEX)
          instruction[:type] = :multiline_field_begin

          @index = match.end(0)

          last_section[:elements].push(instruction)
          last_continuable_element = nil
          last_non_section_element = instruction

          terminator_regex = /\n[^\S\n]*(#{operator})(?!-)[^\S\n]*(#{Regexp.escape(key)})[^\S\n]*(?=\n|$)/
          terminator_match = terminator_regex.match(@context.input, @index)

          @index += 1  # move past current char (\n) into next line
          @line += 1

          unless terminator_match
            parse_after_error
            raise Errors::Parsing.unterminated_multiline_field(@context, instruction)
          end

          end_of_multiline_field_index = terminator_match.begin(0)

          if end_of_multiline_field_index != @index - 1
            instruction[:lines] = []

            loop do
              end_of_line_index = @context.input.index("\n", @index)

              if !end_of_line_index || end_of_line_index >= end_of_multiline_field_index
                last_non_section_element[:lines].push(
                  line: @line,
                  ranges: {
                    line: [@index, end_of_multiline_field_index],
                    value: [@index, end_of_multiline_field_index]
                  },
                  type: :multiline_field_value
                )

                @index = end_of_multiline_field_index + 1
                @line += 1

                break
              else
                last_non_section_element[:lines].push(
                  line: @line,
                  ranges: {
                    line: [@index, end_of_line_index],
                    value: [@index, end_of_line_index]
                  },
                  type: :multiline_field_value
                )

                @index = end_of_line_index + 1
                @line += 1
              end
            end
          end

          instruction = {
            length: terminator_match.end(0),
            line: @line,
            ranges: {
              key: terminator_match.offset(2),
              line: [@index, terminator_match.end(0)],
              multiline_field_operator: terminator_match.offset(1)
            },
            type: :multiline_field_end
          }

          last_non_section_element[:end] = instruction
          last_non_section_element = nil

          @index = terminator_match.end(0) + 1
          @line += 1

          multiline_field = true

        elsif match[Grammar::COMMENT_OPERATOR_INDEX]

          if comments
            comments.push(instruction)
          else
            comments = [instruction]
          end

          instruction[:ranges][:comment_operator] = match.offset(Grammar::COMMENT_OPERATOR_INDEX)
          instruction[:type] = :comment

          comment = match[Grammar::COMMENT_VALUE_INDEX]

          if comment
            instruction[:comment] = comment
            instruction[:ranges][:comment] = match.offset(Grammar::COMMENT_VALUE_INDEX)
          end

        elsif match[Grammar::KEY_UNESCAPED_INDEX]

          if comments
            instruction[:comments] = comments
            comments = nil
          end

          instruction[:key] = match[Grammar::KEY_UNESCAPED_INDEX]
          instruction[:ranges][:key] = match.offset(Grammar::KEY_UNESCAPED_INDEX)
          instruction[:type] = :empty

          instruction[:parent] = last_section
          last_section[:elements].push(instruction)
          last_continuable_element = nil
          last_non_section_element = instruction

        elsif match[Grammar::KEY_ESCAPED_INDEX]

          if comments
            instruction[:comments] = comments
            comments = nil
          end

          instruction[:key] = match[Grammar::KEY_ESCAPED_INDEX]
          instruction[:ranges][:escape_begin_operator] = match.offset(Grammar::KEY_ESCAPE_BEGIN_OPERATOR_INDEX)
          instruction[:ranges][:escape_end_operator] = match.offset(Grammar::KEY_ESCAPE_END_OPERATOR_INDEX)
          instruction[:ranges][:key] = match.offset(Grammar::KEY_ESCAPED_INDEX)
          instruction[:type] = :empty

          instruction[:parent] = last_section
          last_section[:elements].push(instruction)
          last_continuable_element = nil
          last_non_section_element = instruction

        end

        unless multiline_field
          @index = match.end(0) + 1
          @line += 1
        end
      end

      @context.line_count = @context.input[-1] == "\n" ? @line + 1 : @line
      @context.meta.concat(comments) if comments
    end

    private

    def parse_after_error(error_instruction = nil)
      if error_instruction
        @context.meta.push(error_instruction)
        @index = error_instruction[:ranges][:line][RANGE_END]
        @line += 1
      end

      while @index < @context.input.length
        end_of_line_index = @context.input.index("\n", @index) || @context.input.length

        instruction = {
          line: @line,
          ranges: { line: [@index, end_of_line_index] },
          type: :unparsed
        }

        error_instruction ||= instruction

        @context.meta.push(instruction)
        @index = end_of_line_index + 1
        @line += 1
      end

      @context.line_count = @context.input[-1] == "\n" ? @line + 1 : @line

      error_instruction
    end
  end
end
