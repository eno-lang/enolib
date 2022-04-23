# frozen_string_literal: true

module Enolib
  class Flag < ElementBase
    def to_s
      "#<Enolib::Flag key=#{@instruction[:key]}>"
    end
  end
end
