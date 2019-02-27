# frozen_string_literal: true

module Enolib
  class MissingEmpty < MissingElementBase
    def to_s
      if @key
        "#<Enolib::MissingEmpty key=#{@key}>"
      else
        '#<Enolib::MissingEmpty>'
      end
    end
  end
end
