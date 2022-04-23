# frozen_string_literal: true

module Enolib
  class MissingSection < MissingElementBase
    def element(key = nil)
      MissingSectionElement.new(key, self)
    end

    def elements
      []
    end

    def embed(key = nil)
      MissingEmbed.new(key, self)
    end
    
    def embeds(_key = nil)
      []
    end
    
    def field(key = nil)
      MissingField.new(key, self)
    end
    
    def fields(_key = nil)
      []
    end

    def flag(key = nil)
      MissingFlag.new(key, self)
    end
    
    def flags(_key = nil)
      []
    end

    def optional_element(_key = nil)
      nil
    end

    def optional_embed(_key = nil)
      nil
    end
    
    def optional_field(_key = nil)
      nil
    end
    
    def optional_flag(_key = nil)
      nil
    end

    def optional_section(_key = nil)
      nil
    end

    def required_element(_key = nil)
      @parent._missing_error(self)
    end

    def required_embed(_key = nil)
      @parent._missing_error(self)
    end
    
    def required_field(_key = nil)
      @parent._missing_error(self)
    end
  
    def required_flag(_key = nil)
      @parent._missing_error(self)
    end

    def required_section(_key = nil)
      @parent._missing_error(self)
    end

    def section(key = nil)
      MissingSection.new(key, self)
    end

    def sections(_key = nil)
      []
    end

    def to_s
      if @key
        "#<Enolib::MissingSection key=#{@key}>"
      else
        '#<Enolib::MissingSection>'
      end
    end
  end
end
