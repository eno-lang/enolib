# frozen_string_literal: true

module Enolib
  class MissingSectionElement < MissingElementBase
    def to_s
      if @key
        "#<Enolib::MissingSectionElement key=#{@key}>"
      else
        '#<Enolib::MissingSectionElement>'
      end
    end
  end
end
