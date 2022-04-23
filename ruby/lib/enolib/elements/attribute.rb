# frozen_string_literal: true

module Enolib
  class Attribute < ValueElementBase
    attr_reader :instruction # TODO: Revisit this hacky exposition
    
    def parent
      @parent || Field.new(@context, @instruction[:parent])
    end

    def to_s
      "#<Enolib::Attribute key=#{@instruction[:key]} value=#{print_value}>"
    end
  end
end
