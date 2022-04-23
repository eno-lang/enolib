# frozen_string_literal: true

module Enolib
  class Element < ElementBase
    def to_s
      "#<Enolib::Element key=#{_key}>"
    end
  end
end
