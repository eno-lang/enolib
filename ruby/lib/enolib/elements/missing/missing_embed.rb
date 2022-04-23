# frozen_string_literal: true

module Enolib
  class MissingEmbed < MissingValueElementBase
    def to_s
      if @key
        "#<Enolib::MissingEmbed key=#{@key}>"
      else
        '#<Enolib::MissingEmbed>'
      end
    end
  end
end
