# frozen_string_literal: true

module Enolib
  class Error < StandardError
    attr_reader :selection, :snippet, :text

    def initialize(text, snippet, selection)
      super("#{text}\n\n#{snippet}")

      @selection = selection
      @snippet = snippet
      @text = text
    end

    def cursor
      @selection[0]
    end
  end

  class ParseError < Error
  end

  class ValidationError < Error
  end
end
