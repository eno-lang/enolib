# frozen_string_literal: true

module Enolib
  module Selections
    RANGE_BEGIN = 0
    RANGE_END = 1
    DOCUMENT_BEGIN = {
      from: { column: 0, index: 0, line: 0 },
      to: { column: 0, index: 0, line: 0 }
    }.freeze

    def self.last_in(element)
      if element.has_key?(:attributes)
        last_in(element[:attributes].last)
      elsif element.has_key?(:continuations)
        element[:continuations].last
      elsif element.has_key?(:items)
        last_in(element[:items].last)
      elsif element[:type] == :embed_begin
        element[:end]
      elsif element[:type] == :section && !element[:elements].empty?
        last_in(element[:elements].last)
      else
        element
      end
    end

    def self.cursor(instruction, range, position)
      index = instruction[:ranges][range][position]

      {
        column: index - instruction[:ranges][:line][RANGE_BEGIN],
        index: index,
        line: instruction[:line]
      }
    end

    def self.selection(instruction, range, position, *to)
      to_instruction = to.find { |argument| argument.is_a?(Hash) } || instruction
      to_range = to.find { |argument| argument.is_a?(Symbol) } || range
      to_position = to.find { |argument| argument.is_a?(Numeric) } || position

      {
        from: cursor(instruction, range, position),
        to: cursor(to_instruction, to_range, to_position)
      }
    end

    def self.select_comments(element)
      comments = element[:comments]

      if comments.length == 1
        if comments.first.has_key?(:comment)
          selection(comments.first, :comment, RANGE_BEGIN, RANGE_END)
        else
          selection(comments.first, :line, RANGE_BEGIN, RANGE_END)
        end
      elsif comments.length > 1
        selection(comments.first, :line, RANGE_BEGIN, comments.last, :line, RANGE_END)
      else
        selection(element, :line, RANGE_BEGIN)
      end
    end

    def self.select_element(element)
      selection(element, :line, RANGE_BEGIN, last_in(element), :line, RANGE_END)
    end

    def self.select_key(element)
      selection(element, :key, RANGE_BEGIN, RANGE_END)
    end

    def self.select_line(element)
      selection(element, :line, RANGE_BEGIN, RANGE_END)
    end
  end
end
