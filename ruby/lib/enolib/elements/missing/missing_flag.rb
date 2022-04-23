# frozen_string_literal: true

module Enolib
  class MissingFlag < MissingElementBase
    def to_s
      if @key
        "#<Enolib::MissingFlag key=#{@key}>"
      else
        '#<Enolib::MissingFlag>'
      end
    end
  end
end
