# frozen_string_literal: true

module Enolib
  def self.parse(input, **options)
    context = Context.new(input, **options)

    Section.new(context, context.document)
  end
end
