# frozen_string_literal: true

module Enolib
  class MissingSection < MissingElementBase
    def element(key = nil)
      MissingSectionElement.new(key, self)
    end

    def elements
      []
    end

    def empty(key = nil)
      MissingEmpty.new(key, self)
    end

    def field(key = nil)
      MissingField.new(key, self)
    end

    def fields(_key = nil)
      []
    end

    def fieldset(key = nil)
      MissingFieldset.new(key, self)
    end

    def fieldsets(_key = nil)
      []
    end

    def list(key = nil)
      MissingList.new(key, self)
    end

    def lists(_key = nil)
      []
    end

    def optional_element(_key = nil)
      nil
    end

    def optional_empty(_key = nil)
      nil
    end

    def optional_field(_key = nil)
      nil
    end

    def optional_fieldset(_key = nil)
      nil
    end

    def optional_list(_key = nil)
      nil
    end

    def optional_section(_key = nil)
      nil
    end

    def required_element(_key = nil)
      @parent._missing_error(self)
    end

    def required_empty(_key = nil)
      @parent._missing_error(self)
    end

    def required_field(_key = nil)
      @parent._missing_error(self)
    end

    def required_fieldset(_key = nil)
      @parent._missing_error(self)
    end

    def required_list(_key = nil)
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
