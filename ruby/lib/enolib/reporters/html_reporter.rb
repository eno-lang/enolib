# frozen_string_literal: true

module Enolib
  class HtmlReporter < Reporter
    def self.report(context, emphasized = [], marked = [])
      emphasized = [emphasized] unless emphasized.is_a?(Array)
      marked = [marked] unless marked.is_a?(Array)

      content_header = context.messages::CONTENT_HEADER
      gutter_header = context.messages::GUTTER_HEADER
      omission = line('...', '...')

      snippet = '<pre class="eno-report">'

      snippet += "<div>#{context.sourceLabel}</div>" if context.source
      snippet += line(gutter_header, content_header)

      in_omission = false

      context[:instructions].each do |instruction|
        emphasize = emphasized.include?(instruction)
        mark = marked.include?(instruction)

        show = (emphasized + marked).any? do |marked_instruction|
          instruction[:line] >= marked_instruction[:line] - 2 &&
          instruction[:line] <= marked_instruction[:line] + 2
        end

        if show
          classes = []

          if emphasize
            classes.push('eno-report-line-emphasized')
          elsif mark
            classes.push('eno-report-line-marked')
          end

          snippet += line(
            (instruction[:line] + Enolib::HUMAN_INDEXING).to_s,
            context[:input][instruction[:index], instruction[:length]],
            classes
          )

          in_omission = false
        elsif !in_omission
          snippet += omission
          in_omission = true
        end
      end

      snippet += '</pre>'

      snippet
    end

    private

    def print_line(line, tag)
      return markup('...', '...') if tag == :omission

      number = (line + HUMAN_INDEXING).to_s
      instruction = @index[line]

      content = ''
      if instruction
        content = @context.input[instruction[:ranges][:line][RANGE_BEGIN]..instruction[:ranges][:line][RANGE_END]]
      end

      tag_class =
        case tag
        when :emphasize
          'eno-report-line-emphasized'
        when :indicate
          'eno-report-line-indicated'
        when :question
          'eno-report-line-questioned'
        else
          ''
        end

      markup(number, content, tag_class)
    end

    def escape(string)
      string.gsub(/[&<>"'\/]/) { |c| HTML_ESCAPE[c] }
    end

    def markup(gutter, content, tag_class = '')
       "<div class=\"eno-report-line #{tag_class}\">" +
       "<div class=\"eno-report-gutter\">#{gutter.rjust(10)}</div>" +
       "<div class=\"eno-report-content\">#{escape(content)}</div>" +
       '</div>'
    end

    def print
      columns_header = markup(@context.messages::GUTTER_HEADER, @context.messages::CONTENT_HEADER)
      snippet = @snippet.each_with_index.map { |tag, line| print_line(line, tag) if tag }.compact.join("\n")

      if @context.source
        return "<div><div>#{@context.source}</div><pre class=\"eno-report\">#{columns_header}#{snippet}</pre></div>"
      end

      "<pre class=\"eno-report\">#{columns_header}#{snippet}</pre>"
    end

    HTML_ESCAPE = {
      '&' => '&amp;',
      '<' => '&lt;',
      '>' => '&gt;',
      '"' => '&quot;',
      "'" => '&#39;',
      '/' => '&#x2F;'
    }.freeze
  end
end
