# frozen_string_literal: true

module Enolib
  class MissingField < MissingValueElementBase
    def to_s
      if @key
        "#<Enolib::MissingField key=#{@key}>"
      else
        '#<Enolib::MissingField>'
      end
    end
  end
end
