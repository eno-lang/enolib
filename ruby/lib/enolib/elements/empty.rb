# frozen_string_literal: true

module Enolib
  class Empty < ElementBase
    def to_s
      "#<Enolib::Empty key=#{@instruction[:key]}>"
    end
  end
end
