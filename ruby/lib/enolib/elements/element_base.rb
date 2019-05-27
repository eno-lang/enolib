# frozen_string_literal: true

module Enolib
  class ElementBase
    def initialize(context, instruction, parent = nil)
      @context = context
      @instruction = instruction
      @parent = parent
    end

    def comment_error(message = nil)
      if block_given?
        message = yield(@context.comment(@instruction))
      elsif message.is_a?(Proc)
        message = message.call(@context.comment(@instruction))
      end

      unless message
        raise ArgumentError, 'A message or message function must be provided'
      end

      Errors::Validation.comment_error(@context, message, @instruction)
    end

    def error(message = nil)
      if block_given?
        message = yield(self)  # Revisit self in this context - problematic
      elsif message.is_a?(Proc)
        message = message.call(self)  # Revisit self in this context - problematic
      end

      unless message
        raise ArgumentError, 'A message or message function must be provided'
      end

      Errors::Validation.element_error(@context, message, @instruction)
    end

    def key(loader = nil)
      loader = Proc.new if block_given?

      @touched = true

      unless loader
        raise ArgumentError, 'A loader function must be provided'
      end

      begin
        loader.call(_key)
      rescue => message
        raise Errors::Validation.key_error(@context, message, @instruction)
      end
    end

    # TODO: All implementations - this could be called on the document (?),
    # via both element and section, most likely triggering erratic behavior
    # because the error->selection chain does not handle the missing key range?
    # (Also being able to call it and doing so does not make sense in the first place)
    def key_error(message = nil)
      if block_given?
        message = yield(_key)
      elsif message.is_a?(Proc)
        message = message.call(_key)
      end

      unless message
        raise ArgumentError, 'A message or message function must be provided'
      end

      Errors::Validation.key_error(@context, message, @instruction)
    end

    def optional_comment(loader = nil)
      loader = Proc.new if block_given?

      unless loader
        raise ArgumentError, 'A loader function must be provided'
      end

      _comment(loader, required: false)
    end

    def optional_string_comment
      _comment(required: false)
    end

    def raw
      @context.raw(@instruction)
    end

    def required_comment(loader = nil)
      loader = Proc.new if block_given?

      unless loader
        raise ArgumentError, 'A loader function must be provided'
      end

      _comment(loader, required: true)
    end

    def required_string_comment
      _comment(required: true)
    end

    def string_key
      @touched = true

      _key
    end

    def touch
      @touched = true
    end

    private

    def _comment(loader = nil, required:)
      @touched = true

      comment = @context.comment(@instruction)

      if comment
        return comment unless loader

        begin
          loader.call(comment)
        rescue => message
          raise Errors::Validation.comment_error(@context, message, @instruction)
        end
      else
        return nil unless required

        raise Errors::Validation.missing_comment(@context, @instruction)
      end
    end

    def _key
      return nil if @instruction[:type] == :document
      return @instruction[:parent][:key] if @instruction[:type] == :list_item

      @instruction[:key]
    end
  end
end
