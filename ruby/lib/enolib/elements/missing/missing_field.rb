# frozen_string_literal: true

module Enolib
  class MissingField < MissingValueElementBase
    def attribute(key = nil)
      MissingAttribute.new(key, self)
    end
    
    def attributes(_key = nil)
      []
    end
    
    def items
      []
    end
    
    def optional_attribute(_key = nil)
      nil
    end
    
    def optional_string_values(_key = nil)
      []
    end
    
    def optional_values(_loader = nil)
      []
    end
    
    def required_attribute(_key = nil)
      @parent._missing_error(self)
    end
    
    def required_string_values(_key = nil)
      []
    end
    
    def required_values(_loader = nil)
      []
    end
    
    def to_s
      if @key
        "#<Enolib::MissingField key=#{@key}>"
      else
        '#<Enolib::MissingField>'
      end
    end
  end
end
