# frozen_string_literal: true

module Enolib
  class MissingValueElementBase < MissingElementBase
    def optional_value(_loader)
      nil
    end

    def optional_string_value
      nil
    end

    def required_string_value
      @parent._missing_error(self)
    end

    def required_value(_loader)
      @parent._missing_error(self)
    end
  end
end
