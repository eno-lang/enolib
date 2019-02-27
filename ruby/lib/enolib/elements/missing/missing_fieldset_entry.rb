# frozen_string_literal: true

module Enolib
  class MissingFieldsetEntry < MissingValueElementBase
    def to_s
      if @key
        "#<Enolib::MissingFieldsetEntry key=#{@key}>"
      else
        '#<Enolib::MissingFieldsetEntry>'
      end
    end
  end
end
