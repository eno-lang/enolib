# frozen_string_literal: true

module Enolib
  module Errors
    module Parsing
      # = value
      # : value
      ATTRIBUTE_OR_FIELD_WITHOUT_KEY = /^\s*([:=]).*$/.freeze
      # --
      # #
      EMBED_OR_SECTION_WITHOUT_KEY = /^\s*(--+|#+).*$/.freeze
      # ` `
      ESCAPE_WITHOUT_KEY = /^\s*(`+)(?!`)(\s+)(\1).*$/.freeze
      # `key` value
      INVALID_AFTER_ESCAPE = /^\s*(`+)(?!`)(?:(?!\1).)+\1\s*([^=:].*?)\s*$/.freeze
      # `key
      UNTERMINATED_ESCAPED_KEY = /^\s*(`+)(?!`)(.*)$/.freeze

      def self.attribute_or_field_without_key(context, instruction, match)
        operator = match[1]
        operator_column = match.begin(1)
        message = operator == '=' ? 'attribute_without_key' : 'field_without_key'
        ParseError.new(
          context.messages.send(message, instruction[:line] + Enolib::HUMAN_INDEXING),
          context.reporter.new(context).report_line(instruction).snippet,
          {
            from: Selections.cursor(instruction, :line, RANGE_BEGIN),
            to: {
              column: operator_column,
              index: instruction[:ranges][:line][RANGE_BEGIN] + operator_column,
              line: instruction[:line]
            }
          }
        )
      end
      
      def self.embed_or_section_without_key(context, instruction, match)
        operator = match[1]
        key_column = match.end(1)
        message = operator.start_with?('-') ? 'embed_without_key' : 'section_without_key'
        ParseError.new(
          context.messages.send(message, instruction[:line] + Enolib::HUMAN_INDEXING),
          context.reporter.new(context).report_line(instruction).snippet,
          {
            from: {
              column: key_column,
              index: instruction[:ranges][:line][RANGE_BEGIN] + key_column,
              line: instruction[:line]
            },
            to: Selections.cursor(instruction, :line, RANGE_END)
          }
        )
      end
      
      def self.escape_without_key(context, instruction, match)
        gap_begin_column = match.end(1)
        gap_end_column = match.begin(3)
        ParseError.new(
          context.messages.escape_without_key(instruction[:line] + Enolib::HUMAN_INDEXING),
          context.reporter.new(context).report_line(instruction).snippet,
          {
            from: {
              column: gap_begin_column,
              index: instruction[:ranges][:line][RANGE_BEGIN] + gap_begin_column,
              line: instruction[:line]
            },
            to: {
              column: gap_end_column,
              index: instruction[:ranges][:line][RANGE_BEGIN] + gap_end_column,
              line: instruction[:line]
            }
          }
        )
      end

      def self.invalid_line(context, instruction)
        line = context.input[instruction[:ranges][:line][RANGE_BEGIN]..instruction[:ranges][:line][RANGE_END]]

        match = ATTRIBUTE_OR_FIELD_WITHOUT_KEY.match(line)
        return attribute_or_field_without_key(context, instruction, match) if match
        
        match = EMBED_OR_SECTION_WITHOUT_KEY.match(line)
        return embed_or_section_without_key(context, instruction, match) if match
        
        match = ESCAPE_WITHOUT_KEY.match(line)
        return escape_without_key(context, instruction, match) if match
        
        match = INVALID_AFTER_ESCAPE.match(line)
        return invalid_after_escape(context, instruction, match) if match
        
        match = UNTERMINATED_ESCAPED_KEY.match(line)
        return unterminated_escaped_key(context, instruction, match) if match
      end

      def self.instruction_outside_field(context, instruction, type)
        ParseError.new(
          context.messages.send(type + '_outside_field', instruction[:line] + Enolib::HUMAN_INDEXING),
          context.reporter.new(context).report_line(instruction).snippet,
          Selections.select_line(instruction)
        )
      end
      
      def self.invalid_after_escape(context, instruction, match)
        invalid_begin_column = match.begin(2)
        invalid_end_column = match.end(2)
        ParseError.new(
          context.messages.invalid_after_escape(instruction[:line] + Enolib::HUMAN_INDEXING),
          context.reporter.new(context).report_line(instruction).snippet,
          {
            from: {
              column: invalid_begin_column,
              index: instruction[:ranges][:line][RANGE_BEGIN] + invalid_begin_column,
              line: instruction[:line]
            },
            to: {
              column: invalid_end_column,
              index: instruction[:ranges][:line][RANGE_BEGIN] + invalid_end_column,
              line: instruction[:line]
            }
          }
        )
      end
      
      def self.mixed_field_content(context, field, conflicting)
        ParseError.new(
          context.messages.mixed_field_content(field[:line] + Enolib::HUMAN_INDEXING),
          context.reporter.new(context).indicate_element(field).report_line(conflicting).snippet,
          Selections.select_line(conflicting)
        )
      end

      def self.section_level_skip(context, section, super_section)
        reporter = context.reporter.new(context).report_line(section)

        reporter.indicate_line(super_section) if super_section[:type] != :document

        ParseError.new(
          context.messages.section_level_skip(section[:line] + Enolib::HUMAN_INDEXING),
          reporter.snippet,
          Selections.select_line(section)
        )
      end

      def self.unterminated_escaped_key(context, instruction, match)
        selection_column = match.end(1)
        ParseError.new(
          context.messages.unterminated_escaped_key(instruction[:line] + Enolib::HUMAN_INDEXING),
          context.reporter.new(context).report_line(instruction).snippet,
          {
            from: {
              column: selection_column,
              index: instruction[:ranges][:line][RANGE_BEGIN] + selection_column,
              line: instruction[:line]
            },
            to: Selections.cursor(instruction, :line, RANGE_END)
          }
        )
      end

      def self.unterminated_embed(context, field)
        reporter = context.reporter.new(context).report_element(field)

        context.meta.each do |instruction|
          reporter.indicate_line(instruction) if instruction[:line] > field[:line]
        end

        ParseError.new(
          context.messages.unterminated_embed(field[:key], field[:line] + Enolib::HUMAN_INDEXING),
          reporter.snippet,
          Selections.select_line(field)
        )
      end
    end
  end
end
