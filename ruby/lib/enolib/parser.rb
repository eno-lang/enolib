# frozen_string_literal: true

module Enolib
  class Parser
    def initialize(context)
      @context = context
      @depth = 0
      @index = 0
      @line = 0
      @unresolved_non_section_elements = {}
      @unresolved_sections = {}
    end

    def run
      if @context.input.empty?
        @context.line_count = 1
        return
      end

      comments = nil
      last_continuable_element = nil
      last_non_section_element = nil
      last_section = @context.document

      while @index < @context.input.length
        match = Grammar::REGEX.match(@context.input, @index)

        unless match && match.begin(0) == @index
          instruction = parse_after_error
          raise Errors::Parsing.invalid_line(@context, instruction)
        end

        instruction = {
          index: @index,
          line: @line,
          ranges: {
            line: match.offset(0)
          }
        }

        multiline_field = false

        # TODO: In all implementations we could optimize the often occurring
        #       empty line case - we need not allocate the instruction object
        #       because it is discarded anyway
        if match[Grammar::EMPTY_LINE_INDEX]

          if comments
            @context.meta.concat(comments)
            comments = nil
          end

        elsif match[Grammar::ELEMENT_OPERATOR_INDEX]

          if comments
            instruction[:comments] = comments
            comments = nil
          end

          instruction[:key] = match[Grammar::KEY_UNESCAPED_INDEX]

          if instruction[:key]
            instruction[:ranges][:element_operator] = match.offset(Grammar::ELEMENT_OPERATOR_INDEX)
            instruction[:ranges][:key] = match.offset(Grammar::KEY_UNESCAPED_INDEX)
          else
            instruction[:key] = match[Grammar::KEY_ESCAPED_INDEX]
            instruction[:ranges][:element_operator] = match.offset(Grammar::ELEMENT_OPERATOR_INDEX)
            instruction[:ranges][:escape_begin_operator] = match.offset(Grammar::KEY_ESCAPE_BEGIN_OPERATOR_INDEX)
            instruction[:ranges][:escape_end_operator] = match.offset(Grammar::KEY_ESCAPE_END_OPERATOR_INDEX)
            instruction[:ranges][:key] = match.offset(Grammar::KEY_ESCAPED_INDEX)
          end

          value = match[Grammar::FIELD_VALUE_INDEX]

          if value
            instruction[:ranges][:value] = match.offset(Grammar::FIELD_VALUE_INDEX)
            instruction[:type] = :field
            instruction[:value] = value
          else
            instruction[:type] = :empty_element
          end

          instruction[:parent] = last_section
          last_section[:elements].push(instruction)
          last_continuable_element = instruction
          last_non_section_element = instruction

        elsif match[Grammar::LIST_ITEM_OPERATOR_INDEX]

          if comments
            instruction[:comments] = comments
            comments = nil
          end

          instruction[:ranges][:item_operator] = match.offset(Grammar::LIST_ITEM_OPERATOR_INDEX)
          instruction[:type] = :list_item

          value = match[Grammar::LIST_ITEM_VALUE_INDEX]

          if value
            instruction[:ranges][:value] = match.offset(Grammar::LIST_ITEM_VALUE_INDEX)
            instruction[:value] = value
          end

          if !last_non_section_element
            parse_after_error(instruction)
            raise Errors::Parsing.missing_list_for_list_item(@context, instruction)
          elsif last_non_section_element[:type] == :list
            last_non_section_element[:items].push(instruction)
          elsif last_non_section_element[:type] == :empty_element
            last_non_section_element[:items] = [instruction]
            last_non_section_element[:type] = :list
          else
            parse_after_error(instruction)
            raise Errors::Parsing.missing_list_for_list_item(@context, instruction)
          end

          instruction[:parent] = last_non_section_element
          last_continuable_element = instruction

        elsif match[Grammar::FIELDSET_ENTRY_OPERATOR_INDEX]

          if comments
            instruction[:comments] = comments
            comments = nil
          end

          instruction[:type] = :fieldset_entry

          instruction[:key] = match[Grammar::KEY_UNESCAPED_INDEX]

          if instruction[:key]
            instruction[:ranges][:key] = match.offset(Grammar::KEY_UNESCAPED_INDEX)
            instruction[:ranges][:entry_operator] = match.offset(Grammar::FIELDSET_ENTRY_OPERATOR_INDEX)
          else
            instruction[:key] = match[Grammar::KEY_ESCAPED_INDEX]
            instruction[:ranges][:entry_operator] = match.offset(Grammar::FIELDSET_ENTRY_OPERATOR_INDEX)
            instruction[:ranges][:escape_begin_operator] = match.offset(Grammar::KEY_ESCAPE_BEGIN_OPERATOR_INDEX)
            instruction[:ranges][:escape_end_operator] = match.offset(Grammar::KEY_ESCAPE_END_OPERATOR_INDEX)
            instruction[:ranges][:key] = match.offset(Grammar::KEY_ESCAPED_INDEX)
          end

          value = match[Grammar::FIELDSET_ENTRY_VALUE_INDEX]

          if value
            instruction[:ranges][:value] = match.offset(Grammar::FIELDSET_ENTRY_VALUE_INDEX)
            instruction[:value] = value
          end

          if !last_non_section_element
            parse_after_error(instruction)
            raise Errors::Parsing.missing_fieldset_for_fieldset_entry(@context, instruction)
          elsif last_non_section_element[:type] == :fieldset
            last_non_section_element[:entries].push(instruction)
          elsif last_non_section_element[:type] == :empty_element
            last_non_section_element[:entries] = [instruction]
            last_non_section_element[:type] = :fieldset
          else
            parse_after_error(instruction)
            raise Errors::Parsing.missing_fieldset_for_fieldset_entry(@context, instruction)
          end

          instruction[:parent] = last_non_section_element
          last_continuable_element = instruction

        elsif match[Grammar::SPACED_LINE_CONTINUATION_OPERATOR_INDEX]

          instruction[:spaced] = true
          instruction[:ranges][:spaced_line_continuation_operator] = match.offset(Grammar::SPACED_LINE_CONTINUATION_OPERATOR_INDEX)
          instruction[:type] = :continuation

          value = match[Grammar::SPACED_LINE_CONTINUATION_VALUE_INDEX]

          if value
            instruction[:ranges][:value] = match.offset(Grammar::SPACED_LINE_CONTINUATION_VALUE_INDEX)
            instruction[:value] = value
          end

          unless last_continuable_element
            parse_after_error(instruction)
            raise Errors::Parsing.missing_element_for_continuation(@context, instruction)
          end

          if last_continuable_element.has_key?(:continuations)
            last_continuable_element[:continuations].push(instruction)
          else
            if last_continuable_element[:type] == :empty_element
              last_continuable_element[:type] = :field
            end

            last_continuable_element[:continuations] = [instruction]
          end

          if comments
            @context.meta.concat(comments)
            comments = nil
          end

        elsif match[Grammar::DIRECT_LINE_CONTINUATION_OPERATOR_INDEX]

          instruction[:ranges][:direct_line_continuation_operator] = match.offset(Grammar::DIRECT_LINE_CONTINUATION_OPERATOR_INDEX)
          instruction[:type] = :continuation

          value = match[Grammar::DIRECT_LINE_CONTINUATION_VALUE_INDEX]

          if value
            instruction[:ranges][:value] = match.offset(Grammar::DIRECT_LINE_CONTINUATION_VALUE_INDEX)
            instruction[:value] = value
          end

          unless last_continuable_element
            parse_after_error(instruction)
            raise Errors::Parsing.missing_element_for_continuation(@context, instruction)
          end

          if last_continuable_element.has_key?(:continuations)
            last_continuable_element[:continuations].push(instruction)
          else
            if last_continuable_element[:type] == :empty_element
              last_continuable_element[:type] = :field
            end

            last_continuable_element[:continuations] = [instruction]
          end

          if comments
            @context.meta.concat(comments)
            comments = nil
          end

        elsif match[Grammar::SECTION_OPERATOR_INDEX]

          if comments
            instruction[:comments] = comments
            comments = nil
          end

          instruction[:elements] = []
          instruction[:ranges][:section_operator] = match.offset(Grammar::SECTION_OPERATOR_INDEX)
          instruction[:type] = :section

          instruction[:key] = match[Grammar::SECTION_KEY_UNESCAPED_INDEX]

          if instruction[:key]
            instruction[:ranges][:key] = match.offset(Grammar::SECTION_KEY_UNESCAPED_INDEX)
          else
            instruction[:key] = match[Grammar::SECTION_KEY_ESCAPED_INDEX]
            instruction[:ranges][:escape_begin_operator] = match.offset(Grammar::SECTION_KEY_ESCAPE_BEGIN_OPERATOR_INDEX)
            instruction[:ranges][:escape_end_operator] = match.offset(Grammar::SECTION_KEY_ESCAPE_END_OPERATOR_INDEX)
            instruction[:ranges][:key] = match.offset(Grammar::SECTION_KEY_ESCAPED_INDEX)
          end

          template = match[Grammar::SECTION_TEMPLATE_INDEX]

          if template
            instruction[:ranges][:template] = match.offset(Grammar::SECTION_TEMPLATE_INDEX)
            instruction[:template] = template

            copy_operator_offset = match.offset(Grammar::SECTION_COPY_OPERATOR_INDEX)

            if copy_operator_offset[1] - copy_operator_offset[0] == 2
              instruction[:deep_copy] = true
              instruction[:ranges][:deep_copy_operator] = copy_operator_offset
            else
              instruction[:ranges][:copy_operator] = copy_operator_offset
            end

            if @unresolved_sections.has_key?(template)
              @unresolved_sections[template][:targets].push(instruction)
            else
              @unresolved_sections[template] = { targets: [instruction] }
            end

            instruction[:copy] = @unresolved_sections[template]
          end

          new_depth = instruction[:ranges][:section_operator][1] - instruction[:ranges][:section_operator][0]

          if new_depth == @depth + 1
            instruction[:parent] = last_section
            @depth = new_depth
          elsif new_depth == @depth
            instruction[:parent] = last_section[:parent]
          elsif new_depth < @depth
            while new_depth < @depth
              last_section = last_section[:parent]
              @depth -= 1
            end

            instruction[:parent] = last_section[:parent]
          else
            parse_after_error(instruction)
            raise Errors::Parsing.section_hierarchy_layer_skip(@context, instruction, last_section)
          end

          instruction[:parent][:elements].push(instruction)

          if template
            parent = instruction[:parent]
            while parent[:type] != :document
              parent[:deep_resolve] = true
              parent = parent[:parent]
            end
          end

          last_section = instruction
          last_continuable_element = nil
          last_non_section_element = nil

        elsif match[Grammar::MULTILINE_FIELD_OPERATOR_INDEX]

          if comments
            instruction[:comments] = comments
            comments = nil
          end

          operator = match[Grammar::MULTILINE_FIELD_OPERATOR_INDEX]
          key = match[Grammar::MULTILINE_FIELD_KEY_INDEX]

          instruction[:key] = key
          instruction[:parent] = last_section
          instruction[:ranges][:multiline_field_operator] = match.offset(Grammar::MULTILINE_FIELD_OPERATOR_INDEX)
          instruction[:ranges][:key] = match.offset(Grammar::MULTILINE_FIELD_KEY_INDEX)
          instruction[:type] = :multiline_field_begin

          @index = match.end(0)

          last_section[:elements].push(instruction)
          last_continuable_element = nil
          last_non_section_element = instruction

          terminator_regex = /\n[^\S\n]*(#{operator})(?!-)[^\S\n]*(#{Regexp.escape(key)})[^\S\n]*(?=\n|$)/
          terminator_match = terminator_regex.match(@context.input, @index)

          @index += 1  # move past current char (\n) into next line
          @line += 1

          unless terminator_match
            parse_after_error
            raise Errors::Parsing.unterminated_multiline_field(@context, instruction)
          end

          end_of_multiline_field_index = terminator_match.begin(0)

          if end_of_multiline_field_index != @index - 1
            instruction[:lines] = []

            loop do
              end_of_line_index = @context.input.index("\n", @index)

              if !end_of_line_index || end_of_line_index >= end_of_multiline_field_index
                last_non_section_element[:lines].push(
                  line: @line,
                  ranges: {
                    line: [@index, end_of_multiline_field_index],
                    value: [@index, end_of_multiline_field_index]
                  },
                  type: :multiline_field_value
                )

                @index = end_of_multiline_field_index + 1
                @line += 1

                break
              else
                last_non_section_element[:lines].push(
                  line: @line,
                  ranges: {
                    line: [@index, end_of_line_index],
                    value: [@index, end_of_line_index]
                  },
                  type: :multiline_field_value
                )

                @index = end_of_line_index + 1
                @line += 1
              end
            end
          end

          instruction = {
            length: terminator_match.end(0),
            line: @line,
            ranges: {
              key: terminator_match.offset(2),
              line: [@index, terminator_match.end(0)],
              multiline_field_operator: terminator_match.offset(1)
            },
            type: :multiline_field_end
          }

          last_non_section_element[:end] = instruction
          last_non_section_element = nil

          @index = terminator_match.end(0) + 1
          @line += 1

          multiline_field = true

        elsif match[Grammar::COMMENT_OPERATOR_INDEX]

          if comments
            comments.push(instruction)
          else
            comments = [instruction]
          end

          instruction[:ranges][:comment_operator] = match.offset(Grammar::COMMENT_OPERATOR_INDEX)
          instruction[:type] = :comment

          comment = match[Grammar::COMMENT_VALUE_INDEX]

          if comment
            instruction[:comment] = comment
            instruction[:ranges][:comment] = match.offset(Grammar::COMMENT_VALUE_INDEX)
          end

        elsif match[Grammar::COPY_OPERATOR_INDEX]

          if comments
            instruction[:comments] = comments
            comments = nil
          end

          template = match[Grammar::TEMPLATE_INDEX]

          instruction[:ranges][:copy_operator] = match.offset(Grammar::COPY_OPERATOR_INDEX)
          instruction[:ranges][:template] = match.offset(Grammar::TEMPLATE_INDEX)
          instruction[:template] = template
          instruction[:type] = :empty_element

          instruction[:key] = match[Grammar::KEY_UNESCAPED_INDEX]

          if instruction[:key]
            instruction[:ranges][:key] = match.offset(Grammar::KEY_UNESCAPED_INDEX)
          else
            instruction[:key] = match[Grammar::KEY_ESCAPED_INDEX]
            instruction[:ranges][:escape_begin_operator] = match.offset(Grammar::KEY_ESCAPE_BEGIN_OPERATOR_INDEX)
            instruction[:ranges][:escape_end_operator] = match.offset(Grammar::KEY_ESCAPE_END_OPERATOR_INDEX)
            instruction[:ranges][:key] = match.offset(Grammar::KEY_ESCAPED_INDEX)
          end

          instruction[:parent] = last_section
          last_section[:elements].push(instruction)
          last_continuable_element = nil
          last_non_section_element = instruction

          if @unresolved_non_section_elements.has_key?(template)
            @unresolved_non_section_elements[template][:targets].push(instruction)
          else
            @unresolved_non_section_elements[template] = { targets: [instruction] }
          end

          instruction[:copy] = @unresolved_non_section_elements[template]
        end

        unless multiline_field
          @index = match.end(0) + 1
          @line += 1
        end
      end

      @context.line_count = @context.input[-1] == "\n" ? @line + 1 : @line
      @context.meta.concat(comments) if comments

      resolve unless @unresolved_non_section_elements.empty? && @unresolved_sections.empty?
    end

    private

    def consolidate_non_section_elements(element, template)
      if template.has_key?(:comments) && !element.has_key?(:comments)
        element[:comments] = template[:comments]
      end

      case element[:type]
      when :empty_element
        case template[:type]
        when :multiline_field_begin
          element[:type] = :field
          mirror(element, template)
        when :field
          element[:type] = :field
          mirror(element, template)
        when :fieldset
          element[:type] = :fieldset
          mirror(element, template)
        when :list
          element[:type] = :list
          mirror(element, template)
        end
      when :fieldset
        case template[:type]
        when :fieldset
          element[:extend] = template
        when :field, :list, :multiline_field_begin
          raise Errors::Parsing.missing_fieldset_for_fieldset_entry(@context, element[:entries].first)
        end
      when :list
        case template[:type]
        when :list
          element[:extend] = template
        when :field, :fieldset, :multiline_field_begin
          raise Errors::Parsing.missing_list_for_list_item(@context, element[:items].first)
        end
      end
    end

    def consolidate_sections(section, template, deep_merge)
      if template.has_key?(:comments) && !section.has_key?(:comments)
        section[:comments] = template[:comments]
      end

      if section[:elements].empty?
        mirror(section, template)
      else
        # TODO: Handle possibility of two templates (one hardcoded in the document, one implicitly derived through deep merging)
        #       Possibly also elswhere (e.g. up there in the mirror branch?)
        section[:extend] = template

        return unless deep_merge

        merge_map = {}

        section[:elements].each do |section_element|
          merge_map[section_element[:key]] =
            if section_element[:type] != :section || merge_map.has_key?(section_element[:key])
              false # non-mergable (no section or multiple instructions with same key)
            else
              { section: section_element }
            end
        end

        template[:elements].each do |section_element|
          next unless merge_map.has_key?(section_element[:key])

          merger = merge_map[section_element[:key]]

          next unless merger

          if section_element[:type] != :section || merger.has_key?(:template)
            merge_map[section_element[:key]] = false # non-mergable (no section or multiple template instructions with same key)
          else
            merger[:template] = section_element
          end
        end

        merge_map.each_value do |merger|
          if merger && merger.has_key?(:template)
            consolidate_sections(merger[:section], merger[:template], true)
          end
        end
      end
    end

    def mirror(element, template)
      if template.has_key?(:mirror)
        element[:mirror] = template[:mirror]
      else
        element[:mirror] = template
      end
    end

    def index(section)
      section[:elements].each do |element|
        if element[:type] == :section
          index(element)

          if @unresolved_sections &&
             @unresolved_sections.has_key?(element[:key]) &&
             element[:key] != element[:template]
            copy_data = @unresolved_sections[element[:key]]

            if copy_data.has_key?(:template)
              raise Errors::Parsing.two_or_more_templates_found(@context, copy_data[:targets].first, copy_data[:template], element)
            end

            copy_data[:template] = element
          end
        elsif @unresolved_non_section_elements &&
              @unresolved_non_section_elements.has_key?(element[:key]) &&
              element[:key] != element[:template]
          copy_data = @unresolved_non_section_elements[element[:key]]

          if copy_data.has_key?(:template)
            raise Errors::Parsing.two_or_more_templates_found(@context, copy_data[:targets].first, copy_data[:template], element)
          end

          copy_data[:template] = element
        end
      end
    end

    def resolve
      index(@context.document)

      if @unresolved_non_section_elements
        @unresolved_non_section_elements.each_value do |copy|
          unless copy.has_key?(:template)
            raise Errors::Parsing.non_section_element_not_found(@context, copy[:targets].first)
          end

          copy[:targets].each do |target|
            resolve_non_section_element(target) if target.has_key?(:copy)
          end
        end
      end

      if @unresolved_sections
        @unresolved_sections.each_value do |copy|
          unless copy.has_key?(:template)
            raise Errors::Parsing.section_not_found(@context, copy[:targets].first)
          end

          copy[:targets].each do |target|
            resolve_section(target) if target.has_key?(:copy)
          end
        end
      end
    end

    def resolve_non_section_element(element, previous_elements = [])
      if previous_elements.include?(element)
        raise Errors::Parsing.cyclic_dependency(@context, element, previous_elements)
      end

      template = element[:copy][:template]

      if template.has_key?(:copy)
        resolve_non_section_element(template, [*previous_elements, element])
      end

      consolidate_non_section_elements(element, template)

      element.delete(:copy)
    end

    def resolve_section(section, previous_sections = [])
      if previous_sections.include?(section)
        raise Errors::Parsing.cyclic_dependency(@context, section, previous_sections)
      end

      if section.has_key?(:deep_resolve)
        section[:elements].each do |section_element|
          if section_element[:type] == :section &&
             (section_element.has_key?(:copy) || section_element.has_key?(:deep_resolve))
            resolve_section(section_element, [*previous_sections, section])
          end
        end
      end

      if section.has_key?(:copy)
        template = section[:copy][:template]

        if template.has_key?(:copy) || template.has_key?(:deep_resolve)
          resolve_section(template, [*previous_sections, section])
        end

        consolidate_sections(section, template, section.has_key?(:deep_copy))

        section.delete(:copy)
      end
    end

    def parse_after_error(error_instruction = nil)
      if error_instruction
        @context.meta.push(error_instruction)
        @index = error_instruction[:ranges][:line][RANGE_END]
        @line += 1
      end

      while @index < @context.input.length
        end_of_line_index = @context.input.index("\n", @index) || @context.input.length

        instruction = {
          line: @line,
          ranges: { line: [@index, end_of_line_index] },
          type: :unparsed
        }

        error_instruction ||= instruction

        @context.meta.push(instruction)
        @index = end_of_line_index + 1
        @line += 1
      end

      @context.line_count = @context.input[-1] == "\n" ? @line + 1 : @line

      error_instruction
    end
  end
end
