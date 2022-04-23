# frozen_string_literal: true

module Enolib
  class Item < ValueElementBase
    def parent
      @parent || List.new(@context, @instruction[:parent])
    end

    def to_s
      "#<Enolib::Item value=#{print_value}>"
    end
  end
end
