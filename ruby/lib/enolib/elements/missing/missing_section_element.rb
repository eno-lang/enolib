# frozen_string_literal: true

module Enolib
  class MissingSectionElement < MissingElementBase
    def to_empty
      MissingEmpty.new(@key, @parent)
    end

    def to_field
      MissingField.new(@key, @parent)
    end

    def to_fieldset
      MissingFieldset.new(@key, @parent)
    end

    def to_list
      MissingList.new(@key, @parent)
    end

    def to_section
      MissingSection.new(@key, @parent)
    end

    def yields_empty
      true
    end

    def yields_field
      true
    end

    def yields_fieldset
      true
    end

    def yields_list
      true
    end

    def yields_section
      true
    end

    def to_s
      if @key
        "#<Enolib::MissingSectionElement key=#{@key}>"
      else
        '#<Enolib::MissingSectionElement>'
      end
    end
  end
end
