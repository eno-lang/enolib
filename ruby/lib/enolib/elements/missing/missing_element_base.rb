# frozen_string_literal: true

module Enolib
  class MissingElementBase
    attr_reader :parent

    def initialize(key, parent)
      @key = key
      @parent = parent
    end

    def _missing_error(_element)
      @parent._missing_error(self)
    end

    def key(_loader)
      @parent._missing_error(self)
    end

    def optional_comment(_loader)
      nil
    end

    def optional_string_comment
      nil
    end

    def required_comment(_loader)
      @parent._missing_error(self)
    end

    def required_string_comment
      @parent._missing_error(self)
    end

    def string_key
      @parent._missing_error(self)
    end
  end
end
