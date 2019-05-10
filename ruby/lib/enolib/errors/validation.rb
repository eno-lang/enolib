# frozen_string_literal: true

module Enolib
  module Errors
    module Validation
      def self.comment_error(context, message, element)
        ValidationError.new(
          context.messages.comment_error(message),
          context.reporter.new(context).report_comments(element).snippet(),
          Selections.select_comments(element)
        )
      end

      def self.element_error(context, message, element)
        ValidationError.new(
          message,
          context.reporter.new(context).report_element(element).snippet(),
          Selections.select_element(element)
        )
      end

      def self.key_error(context, message, element)
        ValidationError.new(
          context.messages.key_error(message),
          context.reporter.new(context).report_line(element).snippet(),
          Selections.select_key(element)
        )
      end

      def self.missing_comment(context, element)
        ValidationError.new(
          context.messages::MISSING_COMMENT,
          context.reporter.new(context).report_line(element).snippet(), # TODO: Question-tag an empty line before an element with missing comment
          Selections.selection(element, :line, RANGE_BEGIN)
        )
      end

      def self.missing_element(context, key, parent, message)
        ValidationError.new(
          key ? context.messages.send(message + '_with_key', key) : context.messages.const_get(message.upcase), # TODO: Solve the upcase rather through a different generated message type, e.g. method instead of constant
          context.reporter.new(context).report_missing_element(parent).snippet(),
          parent[:type] == :document ? Selections::DOCUMENT_BEGIN : Selections.selection(parent, :line, RANGE_END)
        )
      end

      def self.missing_value(context, element)
        selection = {}

        if element[:type] == :field ||
           element[:type] == :empty_element ||
           element[:type] == :multiline_field_begin
          message = context.messages.missing_field_value(element[:key])

          if element[:ranges].has_key?(:template)
            selection[:from] = Selections::cursor(element, :template, RANGE_END)
          elsif element[:ranges].has_key?(:element_operator)
            selection[:from] = Selections::cursor(element, :element_operator, RANGE_END)
          else
            selection[:from] = Selections::cursor(element, :line, RANGE_END)
          end
        elsif element[:type] == :fieldset_entry
          message = context.messages.missing_fieldset_entry_value(element[:key])
          selection[:from] = Selections.cursor(element, :entry_operator, RANGE_END)
        elsif element[:type] == :list_item
          message = context.messages.missing_list_item_value(element[:parent][:key])
          selection[:from] = Selections.cursor(element, :item_operator, RANGE_END)
        end

        snippet = context.reporter.new(context).report_element(element).snippet()

        if element[:type] == :field and element.has_key?(:continuations)
          selection[:to] = Selections::cursor(element[:continuations].last, :line, RANGE_END)
        else
          selection[:to] = Selections::cursor(element, :line, RANGE_END)
        end

        ValidationError.new(message, snippet, selection)
      end

      def self.unexpected_element(context, message, element)
        ValidationError.new(
          message || context.messages::UNEXPECTED_ELEMENT,
          context.reporter.new(context).report_element(element).snippet(),
          Selections.select_element(element)
        )
      end

      def self.unexpected_multiple_elements(context, key, elements, message)
        ValidationError.new(
          key ? context.messages.send(message + '_with_key', key) : context.messages.const_get(message.upcase), # TODO: Solve the upcase rather through a different generated message type, e.g. method instead of constant
          context.reporter.new(context).report_elements(elements).snippet(),
          Selections.select_element(elements[0])
        )
      end

      def self.unexpected_element_type(context, key, section, message)
        ValidationError.new(
          key ? context.messages.send(message + '_with_key', key) : context.messages.const_get(message.upcase), # TODO: Solve the upcase rather through a different generated message type, e.g. method instead of constant
          context.reporter.new(context).report_element(section).snippet(),
          Selections.select_element(section)
        )
      end

      def self.value_error(context, message, element)
        if element.has_key?(:mirror)
          snippet = context.reporter.new(context).report_line(element).snippet()
          select = select_key(element)
        elsif element[:type] == :multiline_field_begin
          if element.has_key?(:lines)
            snippet = context.reporter.new(context).report_multiline_value(element).snippet()
            select = Selections.selection(element[:lines][0], :line, RANGE_BEGIN, element[:lines][-1], :line, RANGE_END)
          else
            snippet = context.reporter.new(context).report_element(element).snippet()
            select = Selections.selection(element, :line, RANGE_END)
          end
        else
          snippet = context.reporter.new(context).report_element(element).snippet()
          select = {}

          if element[:ranges].has_key?(:value)
            select[:from] = Selections::cursor(element, :value, RANGE_BEGIN)
          elsif element[:ranges].has_key?(:element_operator)
            select[:from] = Selections::cursor(element, :element_operator, RANGE_END)
          elsif element[:ranges].has_key?(:entry_operator)
            select[:from] = Selections::cursor(element, :entry_operator, RANGE_END)
          elsif element[:type] == :list_item
            select[:from] = Selections::cursor(element, :item_operator, RANGE_END)
          else
            # TODO: Possibly never reached - think through state permutations
            select[:from] = Selections::cursor(element, :line, RANGE_END)
          end

          if element.has_key?(:continuations)
            select[:to] = Selections::cursor(element[:continuations][-1], :line, RANGE_END)
          elsif element[:ranges].has_key?(:value)
            select[:to] = Selections::cursor(element, :value, RANGE_END)
          else
            select[:to] = Selections::cursor(element, :line, RANGE_END)
          end
        end

        ValidationError.new(context.messages.value_error(message), snippet, select)
      end
    end
  end
end
