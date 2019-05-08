# frozen_string_literal: true

module Enolib
  class Reporter
    def initialize(context)
      @context = context
      @index = Array.new(@context.line_count)
      @snippet = Array.new(@context.line_count)

      build_index
    end

    def indicate_line(element)
      @snippet[element[:line]] = :indicate
      self
    end

    def question_line(element)
      @snippet[element[:line]] = :question
      self
    end

    def report_comments(element)
      @snippet[element[:line]] = :indicate
      element[:comments].each do |comment|
        @snippet[comment[:line]] = :emphasize
      end

      self
    end

    def report_element(element)
      @snippet[element[:line]] = :emphasize
      tag_element(element, :indicate)

      self
    end

    def report_elements(elements)
      elements.each do |element|
        @snippet[element[:line]] = :emphasize
        tag_element(element, :indicate)
      end

      self
    end

    def report_line(instruction)
      @snippet[instruction[:line]] = :emphasize

      self
    end

    def report_multiline_value(element)
      element[:lines].each do |line|
        @snippet[line[:line]] = :emphasize
      end

      self
    end

    def report_missing_element(parent)
      @snippet[parent[:line]] = :indicate unless parent[:type] == :document

      if parent[:type] == :section
        tag_section(parent, :question, false)
      else
        tag_element(parent, :question)
      end

      self
    end

    def snippet
      if @snippet.none?
        (0...@snippet.length).each do |line|
          @snippet[line] = :question
        end
      else
        # TODO: Possibly better algorithm for this
        @snippet.each_with_index do |tag, line|
          next if tag

          if line + 2 < @context.line_count && @snippet[line + 2] && @snippet[line + 2] != :display ||
             line - 2 > 0 && @snippet[line - 2] && @snippet[line - 2] != :display ||
             line + 1 < @context.line_count && @snippet[line + 1] && @snippet[line + 1] != :display ||
             line - 1 > 0 && @snippet[line - 1] && @snippet[line - 1] != :display
            @snippet[line] = :display
          elsif line + 3 < @context.line_count && @snippet[line + 3] && @snippet[line + 3] != :display
            @snippet[line] = :omission
          end
        end

        @snippet[-1] = :omission unless @snippet[-1]
      end

      print
    end

    private

    def index_comments(element)
      return unless element.has_key?(:comments)

      element[:comments].each do |comment|
        @index[comment[:line]] = comment
      end
    end

    def traverse(section)
      section[:elements].each do |element|
        index_comments(element)

        @index[element[:line]] = element

        if element[:type] == :section
          traverse(element)
        elsif element[:type] == :field
          if element.has_key?(:continuations)
            element[:continuations].each do |continuation|
              @index[continuation[:line]] = continuation
            end
          end
        elsif element[:type] == :multiline_field_begin
          # Missing when reporting an unterminated multiline field
          if element.has_key?(:end)
            @index[element[:end][:line]] = element[:end]
          end

          if element.has_key?(:lines)
            element[:lines].each do |line|
              @index[line[:line]] = line
            end
          end
        elsif element[:type] == :list
          if element.has_key?(:items)
            element[:items].each do |item|
              index_comments(item)

              @index[item[:line]] = item

              if item.has_key?(:continuations)
                item[:continuations].each do |continuation|
                  @index[continuation[:line]] = continuation
                end
              end
            end
          end
        elsif element[:type] == :fieldset
          if element.has_key?(:entries)
            element[:entries].each do |entry|
              index_comments(entry)

              @index[entry[:line]] = entry

              if entry.has_key?(:continuations)
                entry[:continuations].each do |continuation|
                  @index[continuation[:line]] = continuation
                end
              end
            end
          end
        end
      end
    end

    def build_index
      traverse(@context.document)

      @context.meta.each do |instruction|
        @index[instruction[:line]] = instruction
      end
    end

    def tag_continuations(element, tag)
      scan_line = element[:line] + 1

      return scan_line unless element.has_key?(:continuations)

      element[:continuations].each do |continuation|
        while scan_line < continuation[:line]
          @snippet[scan_line] = tag
          scan_line += 1
        end

        @snippet[continuation[:line]] = tag
        scan_line += 1
      end

      scan_line
    end

    def tag_continuables(element, collection, tag)
      scan_line = element[:line] + 1

      return scan_line unless element.has_key?(collection)

      element[collection].each do |continuable|
        while scan_line < continuable[:line]
          @snippet[scan_line] = tag
          scan_line += 1
        end

        @snippet[continuable[:line]] = tag

        scan_line = tag_continuations(continuable, tag)
      end

      scan_line
    end

    def tag_element(element, tag)
      if element[:type] == :field || element[:type] == :list_item || element[:type] == :fieldset_entry
        return tag_continuations(element, tag)
      elsif element[:type] == :list
        return tag_continuables(element, :items, tag)
      elsif element[:type] == :fieldset && element.has_key?(:entries)
        return tag_continuables(element, :entries, tag)
      elsif element[:type] == :multiline_field_begin
        if element.has_key?(:lines)
          element[:lines].each do |line|
            @snippet[line[:line]] = tag
          end
        end

        if element.has_key?(:end)
          @snippet[element[:end][:line]] = tag
          return element[:end][:line] + 1
        elsif element.has_key?(:lines)
          return element[:lines][-1][:line] + 1
        else
          return element[:line] + 1
        end
      elsif element[:type] == :section
        return tag_section(element, tag)
      end
    end

    def tag_section(section, tag, recursive=true)
      scan_line = section[:line] + 1

      section[:elements].each do |element|
        while scan_line < element[:line]
          @snippet[scan_line] = tag
          scan_line += 1
        end

        break if element[:type] == :section && !recursive

        @snippet[element[:line]] = tag

        scan_line = tag_element(element, tag)
      end

      scan_line
    end
  end
end
