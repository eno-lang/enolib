# frozen_string_literal: true

module Enolib
  module Errors
    module Parsing
      UNTERMINATED_ESCAPED_KEY = /^\s*#*\s*(`+)(?!`)((?:(?!\1).)+)$/

      def self.cyclic_dependency(context, instruction, instruction_chain)
        first_occurrence = instruction_chain.find_index(instruction)
        feedback_chain = instruction_chain[first_occurrence..-1]

        if feedback_chain.last.has_key?(:template)
          copy_instruction = feedback_chain.last
        elsif feedback_chain.first.has_key?(:template)  # TODO: Here and elsewhere, do we even need to check this? One has to be it, right?
          copy_instruction = feedback_chain.first
        end

        reporter = context.reporter.new(context)

        reporter.report_line(copy_instruction)

        feedback_chain.each do |element|
          reporter.indicate_line(element) if element != copy_instruction
        end

        ParseError.new(
          context.messages::cyclic_dependency(copy_instruction[:line] + Enolib::HUMAN_INDEXING, copy_instruction[:template]),
          reporter.snippet,
          Selections::select_template(copy_instruction)
        )
      end

      def self.invalid_line(context, instruction)
        line = context.input[instruction[:ranges][:line][RANGE_BEGIN]..instruction[:ranges][:line][RANGE_END]]

        match = UNTERMINATED_ESCAPED_KEY.match(line)
        return unterminated_escaped_key(context, instruction, match.end(1)) if match

        ParseError.new(
          context.messages::invalid_line(instruction[:line] + Enolib::HUMAN_INDEXING),
          context.reporter.new(context).report_line(instruction).snippet,
          Selections::select_line(instruction)
        )
      end

      def self.missing_element_for_continuation(context, continuation)
        ParseError.new(
          context.messages::missing_element_for_continuation(continuation[:line] + Enolib::HUMAN_INDEXING),
          context.reporter.new(context).report_line(continuation).snippet,
          Selections::select_line(continuation)
        )
      end

      def self.missing_fieldset_for_fieldset_entry(context, entry)
        ParseError.new(
          context.messages::missing_fieldset_for_fieldset_entry(entry[:line] + Enolib::HUMAN_INDEXING),
          context.reporter.new(context).report_line(entry).snippet,
          Selections::select_line(entry)
        )
      end

      def self.missing_list_for_list_item(context, item)
        ParseError.new(
          context.messages::missing_list_for_list_item(item[:line] + Enolib::HUMAN_INDEXING),
          context.reporter.new(context).report_line(item).snippet,
          Selections::select_line(item)
        )
      end

      def self.non_section_element_not_found(context, copy)
        ParseError.new(
          context.messages::non_section_element_not_found(copy[:line] + Enolib::HUMAN_INDEXING, copy[:template]),
          context.reporter.new(context).report_line(copy).snippet,
          Selections::select_line(copy)
        )
      end

      def self.section_hierarchy_layer_skip(context, section, super_section)
        reporter = context.reporter.new(context).report_line(section)

        reporter.indicate_line(super_section) if super_section[:type] != :document

        ParseError.new(
          context.messages::section_hierarchy_layer_skip(section[:line] + Enolib::HUMAN_INDEXING),
          reporter.snippet,
          Selections::select_line(section)
        )
      end

      def self.section_not_found(context, copy)
        ParseError.new(
          context.messages::section_not_found(copy[:line] + Enolib::HUMAN_INDEXING, copy[:template]),
          context.reporter.new(context).report_line(copy).snippet,
          Selections::select_line(copy)
        )
      end

      def self.unterminated_escaped_key(context, instruction, selection_column)
        ParseError.new(
          context.messages::unterminated_escaped_key(instruction[:line] + Enolib::HUMAN_INDEXING),
          context.reporter.new(context).report_line(instruction).snippet,
          {
            from: {
              column: selection_column,
              index: instruction[:ranges][:line][RANGE_BEGIN] + selection_column,
              line: instruction[:line]
            },
            to: Selections::cursor(instruction, :line, RANGE_END)
          }
        )
      end

      def self.two_or_more_templates_found(context, copy, first_template, second_template)
        ParseError.new(
          context.messages::two_or_more_templates_found(copy[:template]),
          context.reporter.new(context).report_line(copy).question_line(first_template).question_line(second_template).snippet,
          Selections::select_line(copy)
        )
      end

      def self.unterminated_multiline_field(context, field)
        reporter = context.reporter.new(context).report_element(field)

        context.meta.each do |instruction|
          reporter.indicate_line(instruction) if instruction[:line] > field[:line]
        end

        ParseError.new(
          context.messages::unterminated_multiline_field(field[:key], field[:line] + Enolib::HUMAN_INDEXING),
          reporter.snippet,
          Selections::select_line(field)
        )
      end
    end
  end
end
