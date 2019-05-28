# frozen_string_literal: true

RANGE_BEGIN = 0
RANGE_END = 1

def check_multiline_field_by_line(field, line)
  return false if line < field[:line] ||
                  line > field[:end][:line]

  if line == field[:line]
    { element: field, instruction: field }
  elsif line == field[:end][:line]
    { element: field, instruction: field[:end] }
  else
    {
      element: field,
      instruction: field[:lines].find { |candidate| candidate[:line] == line }
    }
  end
end

def check_multiline_field_by_index(field, index)
  return false if index < field[:ranges][:line][RANGE_BEGIN] ||
                  index > field[:end][:ranges][:line][RANGE_END]

  if index <= field[:ranges][:line][RANGE_END]
    { element: field, instruction: field }
  elsif index >= field[:end][:ranges][:line][RANGE_BEGIN]
    { element: field, instruction: field[:end] }
  else
    {
      element: field,
      instruction: field[:lines].find { |candidate| index <= candidate[:ranges][:line][RANGE_END] }
    }
  end
end

def check_field_by_line(field, line)
  return false if line < field[:line]
  return { element: field, instruction: field } if line == field[:line]
  return false unless field.has_key?(:continuations) &&
                      line <= field[:continuations].last[:line]

  field[:continuations].each do |continuation|
    return { element: field, instruction: continuation } if line == continuation[:line]
    return { element: field, instruction: nil } if line < continuation[:line]
  end
end

def check_field_by_index(field, index)
  return false if index < field[:ranges][:line][RANGE_BEGIN]
  return { element: field, instruction: field } if index <= field[:ranges][:line][RANGE_END]
  return false unless field.has_key?(:continuations) &&
                      index <= field[:continuations].last[:ranges][:line][RANGE_END]

  field[:continuations].each do |continuation|
    return { element: field, instruction: nil } if index < continuation[:ranges][:line][RANGE_BEGIN]
    return { element: field, instruction: continuation } if index <= continuation[:ranges][:line][RANGE_END]
  end
end

def check_fieldset_by_line(fieldset, line)
  return false if line < fieldset[:line]
  return { element: fieldset, instruction: fieldset } if line == fieldset[:line]
  return false unless fieldset.has_key?(:entries) &&
                      line <= fieldset[:entries].last[:line]

  fieldset[:entries].each do |entry|
    return { element: entry, instruction: entry } if line == entry[:line]

    if line < entry[:line]
      if entry.has_key?(:comments) && line >= entry[:comments][0][:line]
        return {
          element: entry,
          instruction: entry[:comments].find { |comment| line == comment[:line] }
        }
      end

      return { element: fieldset, instruction: nil }
    end

    match_in_entry = check_field_by_line(entry, line)

    return match_in_entry if match_in_entry
  end
end

def check_fieldset_by_index(fieldset, index)
  return false if index < fieldset[:ranges][:line][RANGE_BEGIN]
  return { element: fieldset, instruction: fieldset } if index <= fieldset[:ranges][:line][RANGE_END]
  return false unless fieldset.has_key?(:entries) &&
                      index <= fieldset[:entries].last[:ranges][:line][RANGE_END]

  fieldset[:entries].each do |entry|
    if index < entry[:ranges][:line][RANGE_BEGIN]
      if entry.has_key?(:comments) && index >= entry[:comments][0][:ranges][:line][RANGE_BEGIN]
        return {
          element: entry,
          instruction: entry[:comments].find { |comment| index <= comment[:ranges][:line][RANGE_END] }
        }
      end

      return { element: fieldset, instruction: nil }
    end

    return { element: entry, instruction: entry } if index <= entry[:ranges][:line][RANGE_END]

    match_in_entry = check_field_by_index(entry, index)

    return match_in_entry if match_in_entry
  end
end

def check_list_by_line(list, line)
  return false if line < list[:line]
  return { element: list, instruction: list } if line == list[:line]
  return false unless list.has_key?(:items) && line > list[:items].last[:line]

  list[:items].each do |item|
    return { element: item, instruction: item } if line == item[:line]

    if line < item[:line]
      if item.has_key?(:comments) && line >= item[:comments][0][:line]
        return {
          element: item,
          instruction: item[:comments].find { |comment| line == comment[:line] }
        }
      end

      return { element: list, instruction: nil }
    end

    match_in_item = check_field_by_line(item, line)

    return match_in_item if match_in_item
  end
end

def check_list_by_index(list, index)
  return false if index < list[:ranges][:line][RANGE_BEGIN]
  return { element: list, instruction: list } if index <= list[:ranges][:line][RANGE_END]
  return false unless list.has_key?(:items) &&
                      index > list[:items].last[:ranges][:line][RANGE_END]

  list[:items].each do |item|
    if index < item[:ranges][:line][RANGE_BEGIN]
      if item.has_key?(:comments) && index >= item[:comments][0][:ranges][:line][RANGE_BEGIN]
        return {
          element: item,
          instruction: item[:comments].find { |comment| index <= comment[:ranges][:line][RANGE_END] }
        }
      end

      return { element: list, instruction: nil }
    end

    return { element: item, instruction: item } if index <= item[:ranges][:line][RANGE_END]

    match_in_item = check_field_by_index(item, index)

    return match_in_item if match_in_item
  end
end

def check_in_section_by_line(section, line)
  section[:elements].reverse_each do |element|
    if element.has_key?(:comments)
      next if line < element[:comments][0][:line]

      if line <= element[:comments][-1][:line]
        return {
          element: element,
          instruction: element[:comments].find { |comment| line == comment[:line] }
        }
      end
    end

    next if element[:line] > line

    return { element: element, instruction: element } if element[:line] == line

    case element[:type]
    when :field
      match_in_field = check_field_by_line(element, line)
      return match_in_field if match_in_field
    when :fieldset
      match_in_fieldset = check_fieldset_by_line(element, line)
      return match_in_fieldset if match_in_fieldset
    when :list
      match_in_list = check_list_by_line(element, line)
      return match_in_list if match_in_list
    when :multiline_field_begin
      unless element.has_key?(:template)
        match_in_multiline_field = check_multiline_field_by_line(element, line)
        return match_in_multiline_field if match_in_multiline_field
      end
    when :section
      return check_in_section_by_line(element, line)
    end

    break
  end

  { element: section, instruction: nil }
end

def check_in_section_by_index(section, index)
  section[:elements].reverse_each do |element|
    if element.has_key?(:comments)
      next if index < element[:comments][0][:ranges][:line][RANGE_BEGIN]

      if index <= element[:comments][-1][:ranges][:line][RANGE_END]
        return {
          element: element,
          instruction: element[:comments].find { |comment| index <= comment[:ranges][:line][RANGE_END] }
        }
      end
    end

    next if index < element[:ranges][:line][RANGE_BEGIN]

    return { element: element, instruction: element } if index <= element[:ranges][:line][RANGE_END]

    case element[:type]
    when :field
      match_in_field = check_field_by_index(element, index)
      return match_in_field if match_in_field
    when :fieldset
      match_in_fieldset = check_fieldset_by_index(element, index)
      return match_in_fieldset if match_in_fieldset
    when :list
      match_in_list = check_list_by_index(element, index)
      return match_in_list if match_in_list
    when :multiline_field_begin
      unless element.has_key?(:template)
        match_in_multiline_field = check_multiline_field_by_index(element, index)
        return match_in_multiline_field if match_in_multiline_field
      end
    when :section
      return check_in_section_by_index(element, index)
    end

    break
  end

  { element: section, instruction: nil }
end

module Enolib
  def self.lookup(input, column: nil, index: nil, line: nil, **options)
    context = Context.new(input, **options)

    match = nil
    if index
      if index < 0 || index > context.input.length
        raise IndexError, "You are trying to look up an index (#{index}) outside of the document's index range (0-#{context.input.length})"
      end

      match = check_in_section_by_index(context.document, index)
    else
      if line < 0 || line >= context.line_count
        raise IndexError, "You are trying to look up a line (#{line}) outside of the document's line range (0-#{context.line_count - 1})"
      end

      match = check_in_section_by_line(context.document, line)
    end

    result = {
      element: Element.new(context, match[:element]),
      range: nil
    }

    instruction = match[:instruction]

    unless instruction
      if index
        instruction = context.meta.find do |candidate|
          index >= candidate[:ranges][:line][RANGE_BEGIN] && index <= candidate[:ranges][:line][RANGE_END]
        end
      else
        instruction = context.meta.find { |candidate| candidate[:line] == line }
      end

      return result unless instruction
    end

    rightmost_match = instruction[:ranges][:line][0]

    unless index
      index = instruction[:ranges][:line][0] + column
    end

    instruction[:ranges].each do |type, range|
      next if type == :line

      if index >= range[RANGE_BEGIN] && index <= range[RANGE_END] && range[RANGE_BEGIN] >= rightmost_match
        result[:range] = type
        # TODO: Provide content of range too as convenience
        rightmost_match = index
      end
    end

    result
  end
end
