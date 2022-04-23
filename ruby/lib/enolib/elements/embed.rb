# frozen_string_literal: true

module Enolib
  class Embed < ValueElementBase
    def parent
      @parent || Section.new(@context, @instruction[:parent])
    end

    def to_s
      "#<Enolib::Embed key=#{@instruction[:key]} value=#{print_value}>"
    end
  end
end
