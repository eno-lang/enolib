# frozen_string_literal: true

module Enolib
  class ValueElementBase < ElementBase
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

    def value_error(message = nil)
      if block_given?
        message = yield(@context.value(@instruction))
      elsif message.is_a?(Proc)
        message = message.call(@context.value(@instruction))
      end

      unless message
        raise ArgumentError, 'A message or message function must be provided'
      end

      Errors::Validation.value_error(@context, message, @instruction)
    end

    private

    def print_value
      value = @context.value(@instruction)

      return 'nil' unless value

      value = "#{value[0..10]}..." if value.length > 14

      value.gsub("\n", '\n')
    end

    def _value(loader = nil, required:)
      @touched = true

      value = @context.value(@instruction)

      if value
        return value unless loader

        begin
          loader.call(value)
        rescue => message
          raise Errors::Validation.value_error(@context, message, @instruction)
        end
      else
        return nil unless required

        raise Errors::Validation.missing_value(@context, @instruction)
      end
    end
  end
end
