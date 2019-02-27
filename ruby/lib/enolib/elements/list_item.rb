# frozen_string_literal: true

module Enolib
  class ListItem < ValueElementBase
    def parent
      @parent || List.new(@context, @instruction[:parent])
    end

    def to_s
      "#<Enolib::ListItem value=#{print_value}>"
    end
  end
end
