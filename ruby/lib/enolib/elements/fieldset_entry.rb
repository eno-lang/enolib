# frozen_string_literal: true

module Enolib
  class FieldsetEntry < ValueElementBase
    attr_reader :instruction # TODO: Revisit this hacky exposition
    
    def parent
      @parent || Fieldset.new(@context, @instruction[:parent])
    end

    def to_s
      "#<Enolib::FieldsetEntry key=#{@instruction[:key]} value=#{print_value}>"
    end
  end
end
