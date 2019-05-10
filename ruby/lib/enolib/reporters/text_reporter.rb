# frozen_string_literal: true

module Enolib
  class TextReporter < Reporter
    INDICATORS = {
      display: ' ',
      emphasize: '>',
      indicate: '*',
      question: '?'
    }.freeze

    def initialize(context)
      super(context)

      gutter_header = context.messages::GUTTER_HEADER.rjust(5)
      columns_header = "  #{gutter_header} | #{context.messages::CONTENT_HEADER}"

      source = context.source ? "-- #{source} -- \n\n" : ''

      @gutter_width = gutter_header.length + 3
      @header = "#{source}#{columns_header}\n"
    end

    private

    def print_line(line, tag)
      return "#{' ' * (@gutter_width - 5)}..." if tag == :omission

      number = (line + Enolib::HUMAN_INDEXING).to_s
      instruction = @index[line]

      content =
        if instruction
          @context.input[instruction[:ranges][:line][0]...instruction[:ranges][:line][1]]
        else
          ''
        end

      " #{INDICATORS[tag]}#{number.rjust(@gutter_width - 3)} | #{content}"
    end

    def print
      @header + @snippet.each_with_index.map { |tag, line| print_line(line, tag) if tag }.compact.join("\n")
    end
  end
end
