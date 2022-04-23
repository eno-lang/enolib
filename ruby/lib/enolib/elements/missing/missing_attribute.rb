# frozen_string_literal: true

module Enolib
  class MissingAttribute < MissingValueElementBase
    def to_s
      if @key
        "#<Enolib::MissingAttribute key=#{@key}>"
      else
        '#<Enolib::MissingAttribute>'
      end
    end
  end
end
