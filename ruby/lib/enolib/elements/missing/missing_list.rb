# frozen_string_literal: true

module Enolib
  class MissingList < MissingElementBase
    def items
      []
    end

    def optional_string_values
      []
    end

    def optional_values(_loader)
      []
    end

    def required_string_values
      []
    end

    def required_values(_loader)
      []
    end

    def to_s
      if @key
        "#<Enolib::MissingList key=#{@key}>"
      else
        '#<Enolib::MissingList>'
      end
    end
  end
end
