# frozen_string_literal: true

module Enolib
  class MissingFieldset < MissingElementBase
    def entries(_key = nil)
      []
    end

    def entry(key = nil)
      MissingFieldsetEntry.new(key, self)
    end

    def optional_entry(_key = nil)
      nil
    end

    def required_entry(_key = nil)
      @parent._missing_error(self)
    end

    def to_s
      if @key
        "#<Enolib::MissingFieldset key=#{@key}>"
      else
        '#<Enolib::MissingFieldset>'
      end
    end
  end
end
