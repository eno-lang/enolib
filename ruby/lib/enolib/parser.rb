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
      last_field = nil
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

        embed = false

        if match[Grammar::EMPTY_LINE_INDEX]

          if comments
            @context.meta.concat(comments)
            comments = nil
          end

        elsif match[Grammar::FIELD_OPERATOR_INDEX]

          if comments
            instruction[:comments] = comments
            comments = nil
          end

          instruction[:key] = match[Grammar::KEY_UNESCAPED_INDEX]
          instruction[:type] = :field

          if instruction[:key]
            instruction[:ranges][:field_operator] = match.offset(Grammar::FIELD_OPERATOR_INDEX)
            instruction[:ranges][:key] = match.offset(Grammar::KEY_UNESCAPED_INDEX)
          else
            instruction[:key] = match[Grammar::KEY_ESCAPED_INDEX]
            instruction[:ranges][:field_operator] = match.offset(Grammar::FIELD_OPERATOR_INDEX)
            instruction[:ranges][:escape_begin_operator] = match.offset(Grammar::KEY_ESCAPE_BEGIN_OPERATOR_INDEX)
            instruction[:ranges][:escape_end_operator] = match.offset(Grammar::KEY_ESCAPE_END_OPERATOR_INDEX)
            instruction[:ranges][:key] = match.offset(Grammar::KEY_ESCAPED_INDEX)
          end

          value = match[Grammar::FIELD_VALUE_INDEX]

          if value
            instruction[:ranges][:value] = match.offset(Grammar::FIELD_VALUE_INDEX)
            instruction[:value] = value
          end

          instruction[:parent] = last_section
          last_section[:elements].push(instruction)
          last_continuable_element = instruction
          last_field = instruction

        elsif match[Grammar::ITEM_OPERATOR_INDEX]

          if comments
            instruction[:comments] = comments
            comments = nil
          end

          instruction[:ranges][:item_operator] = match.offset(Grammar::ITEM_OPERATOR_INDEX)
          instruction[:type] = :item

          value = match[Grammar::ITEM_VALUE_INDEX]

          if value
            instruction[:ranges][:value] = match.offset(Grammar::ITEM_VALUE_INDEX)
            instruction[:value] = value
          end

          if !last_field
            parse_after_error(instruction)
            raise Errors::Parsing.instruction_outside_field(@context, instruction, 'item')
          elsif last_field.has_key?(:items)
            last_field[:items].push(instruction)
          elsif last_field.has_key?(:attributes) ||
                last_field.has_key?(:continuations) ||
                last_field.has_key?(:value)
            parse_after_error(instruction)
            raise Errors::Parsing.mixed_field_content(@context, last_field, instruction)
          else
            last_field[:items] = [instruction]
          end

          instruction[:parent] = last_field
          last_continuable_element = instruction

        elsif match[Grammar::ATTRIBUTE_OPERATOR_INDEX]

          if comments
            instruction[:comments] = comments
            comments = nil
          end

          instruction[:type] = :attribute

          instruction[:key] = match[Grammar::KEY_UNESCAPED_INDEX]

          if instruction[:key]
            instruction[:ranges][:key] = match.offset(Grammar::KEY_UNESCAPED_INDEX)
            instruction[:ranges][:attribute_operator] = match.offset(Grammar::ATTRIBUTE_OPERATOR_INDEX)
          else
            instruction[:key] = match[Grammar::KEY_ESCAPED_INDEX]
            instruction[:ranges][:attribute_operator] = match.offset(Grammar::ATTRIBUTE_OPERATOR_INDEX)
            instruction[:ranges][:escape_begin_operator] = match.offset(Grammar::KEY_ESCAPE_BEGIN_OPERATOR_INDEX)
            instruction[:ranges][:escape_end_operator] = match.offset(Grammar::KEY_ESCAPE_END_OPERATOR_INDEX)
            instruction[:ranges][:key] = match.offset(Grammar::KEY_ESCAPED_INDEX)
          end

          value = match[Grammar::ATTRIBUTE_VALUE_INDEX]

          if value
            instruction[:ranges][:value] = match.offset(Grammar::ATTRIBUTE_VALUE_INDEX)
            instruction[:value] = value
          end
          
          if !last_field
            parse_after_error(instruction)
            raise Errors::Parsing.instruction_outside_field(@context, instruction, 'attribute')
          elsif last_field.has_key?(:attributes)
            last_field[:attributes].push(instruction)
          elsif last_field.has_key?(:continuations) ||
                last_field.has_key?(:items) ||
                last_field.has_key?(:value)
            parse_after_error(instruction)
            raise Errors::Parsing.mixed_field_content(@context, last_field, instruction)
          else
            last_field[:attributes] = [instruction]
          end

          instruction[:parent] = last_field
          last_continuable_element = instruction

        elsif match[Grammar::CONTINUATION_OPERATOR_INDEX]

          if match[Grammar::CONTINUATION_OPERATOR_INDEX] == '\\'
            instruction[:spaced] = true
            instruction[:ranges][:spaced_continuation_operator] = match.offset(Grammar::CONTINUATION_OPERATOR_INDEX)
          else
            instruction[:ranges][:direct_continuation_operator] = match.offset(Grammar::CONTINUATION_OPERATOR_INDEX)
          end

          instruction[:type] = :continuation

          value = match[Grammar::CONTINUATION_VALUE_INDEX]

          if value
            instruction[:ranges][:value] = match.offset(Grammar::CONTINUATION_VALUE_INDEX)
            instruction[:value] = value
          end

          unless last_continuable_element
            parse_after_error(instruction)
            raise Errors::Parsing.instruction_outside_field(@context, instruction, 'continuation')
          end

          if last_continuable_element.has_key?(:continuations)
            last_continuable_element[:continuations].push(instruction)
          else
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
            raise Errors::Parsing.section_level_skip(@context, instruction, last_section)
          end

          instruction[:parent][:elements].push(instruction)

          last_section = instruction
          last_continuable_element = nil
          last_field = nil

        elsif match[Grammar::EMBED_OPERATOR_INDEX]

          if comments
            instruction[:comments] = comments
            comments = nil
          end

          operator = match[Grammar::EMBED_OPERATOR_INDEX]
          key = match[Grammar::EMBED_KEY_INDEX]

          instruction[:key] = key
          instruction[:parent] = last_section
          instruction[:ranges][:embed_operator] = match.offset(Grammar::EMBED_OPERATOR_INDEX)
          instruction[:ranges][:key] = match.offset(Grammar::EMBED_KEY_INDEX)
          instruction[:type] = :embed_begin

          @index = match.end(0)

          last_section[:elements].push(instruction)
          last_continuable_element = nil
          begin_instruction = instruction

          terminator_regex = /\n[^\S\n]*(#{operator})(?!-)[^\S\n]*(#{Regexp.escape(key)})[^\S\n]*(?=\n|$)/
          terminator_match = terminator_regex.match(@context.input, @index)

          @index += 1  # move past current char (\n) into next line
          @line += 1

          unless terminator_match
            parse_after_error
            raise Errors::Parsing.unterminated_embed(@context, instruction)
          end

          end_of_embed_index = terminator_match.begin(0)

          if end_of_embed_index != @index - 1
            instruction[:lines] = []

            loop do
              end_of_line_index = @context.input.index("\n", @index)

              if !end_of_line_index || end_of_line_index >= end_of_embed_index
                begin_instruction[:lines].push(
                  line: @line,
                  ranges: {
                    line: [@index, end_of_embed_index],
                    value: [@index, end_of_embed_index]
                  },
                  type: :embed_value
                )

                @index = end_of_embed_index + 1
                @line += 1

                break
              else
                begin_instruction[:lines].push(
                  line: @line,
                  ranges: {
                    line: [@index, end_of_line_index],
                    value: [@index, end_of_line_index]
                  },
                  type: :embed_value
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
              embed_operator: terminator_match.offset(1)
            },
            type: :embed_end
          }

          begin_instruction[:end] = instruction
          last_field = nil

          @index = terminator_match.end(0) + 1
          @line += 1

          embed = true

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
          instruction[:type] = :flag

          instruction[:parent] = last_section
          last_section[:elements].push(instruction)
          last_continuable_element = nil
          last_field = instruction

        elsif match[Grammar::KEY_ESCAPED_INDEX]

          if comments
            instruction[:comments] = comments
            comments = nil
          end

          instruction[:key] = match[Grammar::KEY_ESCAPED_INDEX]
          instruction[:ranges][:escape_begin_operator] = match.offset(Grammar::KEY_ESCAPE_BEGIN_OPERATOR_INDEX)
          instruction[:ranges][:escape_end_operator] = match.offset(Grammar::KEY_ESCAPE_END_OPERATOR_INDEX)
          instruction[:ranges][:key] = match.offset(Grammar::KEY_ESCAPED_INDEX)
          instruction[:type] = :flag

          instruction[:parent] = last_section
          last_section[:elements].push(instruction)
          last_continuable_element = nil
          last_field = instruction

        end

        unless embed
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
