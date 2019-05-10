# frozen_string_literal: true

RESET = "\x1b[0m"
BOLD = "\x1b[1m"
DIM = "\x1b[2m"

BLACK = "\x1b[30m"
BRIGHT_BLACK = "\x1b[90m"
WHITE = "\x1b[37m"
BRIGHT_WHITE = "\x1b[97m"

BRIGHT_BLACK_BACKGROUND = "\x1b[40m"
BRIGHT_RED_BACKGROUND = "\x1b[101m"
WHITE_BACKGROUND = "\x1b[47m"

INDICATORS = {
  display: ' ',
  emphasize: '>',
  indicate: '*',
  question: '?'
}.freeze

GUTTER_STYLE = {
  display: BRIGHT_BLACK_BACKGROUND,
  emphasize: BLACK + BRIGHT_RED_BACKGROUND,
  indicate: BLACK + WHITE_BACKGROUND,
  question: BLACK + WHITE_BACKGROUND
}.freeze

RANGE_STYLE = {
  'element_operator': WHITE,
  'escape_begin_operator': WHITE,
  'escape_end_operator': WHITE,
  'item_operator': WHITE,
  'entry_operator': WHITE,
  'section_operator': WHITE,
  'copy_operator': WHITE,
  'deepCopy_operator': WHITE,
  'multiline_field_operator': WHITE,
  'direct_line_continuation_operator': WHITE,
  'spaced_line_continuation_operator': WHITE,
  'key': BOLD + BRIGHT_WHITE,
  'template': BOLD + BRIGHT_WHITE,
  'value': DIM + WHITE
}.freeze

module Enolib
  class TerminalReporter < Reporter
    def initialize(context)
      super(context)

      highest_shown_line_number = @snippet.length

      @snippet.reverse.each_with_index do |tag, index|
        if tag && tag != :omission
          highest_shown_line_number = index + 1
          break
        end
      end

      @line_number_padding = [4, highest_shown_line_number.to_s.length].max
      @header = ''

      if @context.source
        @header += "#{BLACK + BRIGHT_RED_BACKGROUND} #{INDICATORS[EMPHASIZE]} #{' '.rjust(@line_number_padding)} #{RESET} #{BOLD}#{@context.source}#{RESET}\n"
      end
    end

    def print_line(line, tag)
      if tag == :omission
        return "#{DIM + BRIGHT_BLACK_BACKGROUND}#{'...'.rjust(@line_number_padding + 2)}  #{RESET}"
      end

      number = (line + HUMAN_INDEXING).to_s
      instruction = @index[line]

      content = ''
      if instruction
        if instruction[:type] == :comment || instruction[:type] == :unparsed
          content = BRIGHT_BLACK + @context.input[instruction[:ranges][:line][RANGE_BEGIN]...instruction[:ranges][:line][RANGE_END]] + RESET
        else
          content = @context.input[instruction[:ranges][:line][RANGE_BEGIN]...instruction[:ranges][:line][RANGE_END]]

          instruction[:ranges].sort_by { |type, range| range[0] }.reverse_each do |type, range|
            next if type == :line

            before = content[0...range[RANGE_BEGIN] - instruction[:ranges][:line][RANGE_BEGIN]]
            after = content[range[RANGE_END] - instruction[:ranges][:line][RANGE_BEGIN]..-1]

            # TODO: Here and everywhere: Why is RANGE_BEGIN without anything and like that even working? Check soundness
            content = before + RANGE_STYLE[type] + @context.input[range[RANGE_BEGIN]...range[RANGE_END]] + RESET + after
          end
        end
      end

      "#{GUTTER_STYLE[tag]} #{INDICATORS[tag]} #{number.rjust(@line_number_padding)} #{RESET} #{content}"
    end

    private

    def print
      snippet = @snippet.each_with_index.map { |tag, line| print_line(line, tag) if tag }.compact.join("\n")

      @header + snippet
    end
  end
end
