# frozen_string_literal: true

module Enolib
  class Context
    attr_accessor :document, :input, :line_count, :messages, :meta, :reporter, :source

    def initialize(input, locale: Locales::En, reporter: TextReporter, source: nil)
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
              next unless comment.has_key?(:comment)

              first_non_empty_line_index ||= index
              last_non_empty_line_index = index

              indent = comment[:ranges][:comment][RANGE_BEGIN] - comment[:ranges][:line][RANGE_BEGIN]
              shared_indent = indent if indent < shared_indent
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

    def value(element)
      unless element.has_key?(:computed_value)
        element[:computed_value] = nil

        if element[:type] == :embed_begin
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

      element[:computed_value]
    end
  end
end
