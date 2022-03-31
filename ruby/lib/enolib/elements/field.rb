# frozen_string_literal: true

module Enolib
  class Field < ValueElementBase
    def optional_string_value
      _value(required: false)
    end

    def optional_value(loader = nil, &block)
      loader = Proc.new(&block) if block_given?

      unless loader
        raise ArgumentError, 'A loader function must be provided'
      end

      _value(loader, required: false)
    end

    def parent
      @parent || Section.new(@context, @instruction[:parent])
    end

    def required_string_value
      _value(required: true)
    end

    def required_value(loader = nil, &block)
      loader = Proc.new(&block) if block_given?

      unless loader
        raise ArgumentError, 'A loader function must be provided'
      end

      _value(loader, required: true)
    end

    def to_s
      "#<Enolib::Field key=#{@instruction[:key]} value=#{print_value}>"
    end
  end
end
