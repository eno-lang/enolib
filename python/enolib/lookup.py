from .context import Context
from .elements.element import Element
from .constants import (
    BEGIN,
    END,
    FIELD,
    FIELDSET,
    LIST,
    MULTILINE_FIELD_BEGIN,
    SECTION
)

def check_multiline_field_by_line(field, line):
    if line < field['line'] or line > field['end']['line']:
        return False

    if line == field['line']:
        return { 'element': field, 'instruction': field }

    if line == field['end']['line']:
        return { 'element': field, 'instruction': field['end'] }

    return {
        'element': field,
        'instruction': next((l for l in field['lines'] if l['line'] == line), None)
    }

def check_multiline_field_by_index(field, index):
    if index < field['ranges']['line'][BEGIN] or index > field['end']['ranges']['line'][END]:
        return False

    if index <= field['ranges']['line'][END]:
        return { 'element': field, 'instruction': field }

    if index >= field['end']['ranges']['line'][BEGIN]:
        return { 'element': field, 'instruction': field['end'] }

    return {
        'element': field,
        'instruction': next((l for l in field['lines'] if index <= l['ranges']['line'][END]), None)
    }

def check_field_by_line(field, line):
    if line < field['line']:
        return False

    if line == field['line']:
        return { 'element': field, 'instruction': field }

    if not 'continuations' in field or line > field['continuations'][-1]['line']:
        return False

    for continuation in field['continuations']:
        if line == continuation['line']:
            return { 'element': field, 'instruction': continuation }
        if line < continuation['line']:
            return { 'element': field, 'instruction': None }

def check_field_by_index(field, index):
    if index < field['ranges']['line'][BEGIN]:
        return False

    if index <= field['ranges']['line'][END]:
        return { 'element': field, 'instruction': field }

    if not 'continuations' in field or index > field['continuations'][-1]['ranges']['line'][END]:
        return False

    for continuation in field['continuations']:
        if index < continuation['ranges']['line'][BEGIN]:
            return { 'element': field, 'instruction': None }
        if index <= continuation['ranges']['line'][END]:
            return { 'element': field, 'instruction': continuation }

def check_fieldset_by_line(fieldset, line):
    if line < fieldset['line']:
        return False

    if line == fieldset['line']:
        return { 'element': fieldset, 'instruction': fieldset }

    if not 'entries' in fieldset or line > fieldset['entries'][-1]['line']:
        return False

    for entry in fieldset['entries']:
        if line == entry['line']:
            return { 'element': entry, 'instruction': entry }

        if line < entry['line']:
            if 'comments' in entry and line >= entry['comments'][0]['line']:
                for comment in entry['comments']:
                    if line == comment['line']:
                        return { 'element': entry, 'instruction': comment }

            return { 'element': fieldset, 'instruction': None }

        match_in_entry = check_field_by_line(entry, line)

        if match_in_entry:
            return match_in_entry

def check_fieldset_by_index(fieldset, index):
    if index < fieldset['ranges']['line'][BEGIN]:
        return False

    if index <= fieldset['ranges']['line'][END]:
        return { 'element': fieldset, 'instruction': fieldset }

    if not 'entries' in fieldset or index > fieldset['entries'][-1]['ranges']['line'][END]:
        return False

    for entry in fieldset['entries']:
        if index < entry['ranges']['line'][BEGIN]:
            if 'comments' in entry and index >= entry['comments'][0]['ranges']['line'][BEGIN]:
                for comment in entry['comments']:
                    if index <= comment['ranges']['line'][END]:
                        return { 'element': entry, 'instruction': comment }

            return { 'element': fieldset, 'instruction': None }

        if index <= entry['ranges']['line'][END]:
            return { 'element': entry, 'instruction': entry }

        match_in_entry = check_field_by_index(entry, index)

        if match_in_entry:
            return match_in_entry

def check_list_by_line(list, line):
    if line < list['line']:
        return False

    if line == list['line']:
        return { 'element': list, 'instruction': list }

    if not 'items' in list or line > list['items'][-1]['line']:
        return False

    for item in list['items']:
        if line == item['line']:
            return { 'element': item, 'instruction': item }

        if line < item['line']:
            if 'comments' in item and line >= item['comments'][0]['line']:
                for comment in item['comments']:
                    if line == comment['line']:
                        return { 'element': item, 'instruction': comment }

            return { 'element': list, 'instruction': None }

        match_in_item = check_field_by_line(item, line)

        if match_in_item:
            return match_in_item

def check_list_by_index(list, index):
    if index < list['ranges']['line'][BEGIN]:
        return False

    if index <= list['ranges']['line'][END]:
        return { 'element': list, 'instruction': list }

    if not 'items' in list or index > list['items'][-1]['ranges']['line'][END]:
        return False

    for item in list['items']:
        if index < item['ranges']['line'][BEGIN]:
            if 'comments' in item and index >= item['comments'][0]['ranges']['line'][BEGIN]:
                for comment in item['comments']:
                    if index <= comment['ranges']['line'][END]:
                        return { 'element': item, 'instruction': comment }

            return { 'element': list, 'instruction': None }

        if index <= item['ranges']['line'][END]:
            return { 'element': item, 'instruction': item }

        match_in_item = check_field_by_index(item, index)

        if match_in_item:
            return match_in_item

def check_in_section_by_line(section, line):
    for element in reversed(section['elements']):
        if 'comments' in element:
            if line < element['comments'][0]['line']:
                continue
            if line <= element['comments'][-1]['line']:
                for comment in element['comments']:
                    if line == comment['line']:
                        return { 'element': element, 'instruction': comment }

        if element['line'] > line:
            continue

        if element['line'] == line:
            return { 'element': element, 'instruction': element }

        if element['type'] is FIELD:
            match_in_field = check_field_by_line(element, line)
            if match_in_field:
                return match_in_field
        elif element['type'] is FIELDSET:
            match_in_fieldset = check_fieldset_by_line(element, line)
            if match_in_fieldset:
                return match_in_fieldset
        elif element['type'] is LIST:
            match_in_list = check_list_by_line(element, line)
            if match_in_list:
                return match_in_list
        elif element['type'] is MULTILINE_FIELD_BEGIN:
            if not 'template' in element:  # TODO: More elegant copy detection?
                match_in_multiline_field = check_multiline_field_by_line(element, line)
                if match_in_multiline_field:
                    return match_in_multiline_field
        elif element['type'] is SECTION:
            return check_in_section_by_line(element, line)

        break

    return { 'element': section, 'instruction': None }

def check_in_section_by_index(section, index):
    for element in reversed(section['elements']):
        if 'comments' in element:
            if index < element['comments'][0]['ranges']['line'][BEGIN]:
                continue
            if index <= element['comments'][-1]['ranges']['line'][END]:
                for comment in element['comments']:
                    if index <= comment['ranges']['line'][END]:
                        return { 'element': element, 'instruction': comment }

        if index < element['ranges']['line'][BEGIN]:
            continue

        if index <= element['ranges']['line'][END]:
            return { 'element': element, 'instruction': element }

        if element['type'] is FIELD:
            match_in_field = check_field_by_index(element, index)
            if match_in_field:
                return match_in_field
        elif element['type'] is FIELDSET:
            match_in_fieldset = check_fieldset_by_index(element, index)
            if match_in_fieldset:
                return match_in_fieldset
        elif element['type'] is LIST:
            match_in_list = check_list_by_index(element, index)
            if match_in_list:
                return match_in_list
        elif element['type'] is MULTILINE_FIELD_BEGIN:
            if not 'template' in element:  # TODO: More elegant copy detection?
                match_in_multiline_field = check_multiline_field_by_index(element, index)
                if match_in_multiline_field:
                    return match_in_multiline_field
        elif element['type'] is SECTION:
            return check_in_section_by_index(element, index)

        break

    return { 'element': section, 'instruction': None }


def lookup(input: str, *, column=None, index=None, line=None, **options):
    context = Context(input, **options)

    match = None
    if index is None:
        if line < 0 or line >= context.line_count:
            raise IndexError(f"You are trying to look up a line ({line}) outside of the document's line range (0-{context.line_count - 1})")

        match = check_in_section_by_line(context.document, line)
    else:
        if index < 0 or index > len(context.input):
            raise IndexError(f"You are trying to look up an index ({index}) outside of the document's index range (0-{len(context.input)})")

        match = check_in_section_by_index(context.document, index)

    result = {
        'element': Element(context, match['element']),
        'range': None
    }

    instruction = match['instruction']

    if not instruction:
        if index is None:
            instruction = next((i for i in context.meta if i['line'] == line), None)
        else:
            instruction = next((i for i in context.meta if index >= i['ranges']['line'][BEGIN] and index <= i['ranges']['line'][END]), None)

        if not instruction:
            return result

    rightmost_match = instruction['ranges']['line'][0]

    if index is None:
        index = instruction['ranges']['line'][0] + column

    for type, range in instruction['ranges'].items():
        if type == 'line':
            continue

        if index >= range[BEGIN] and index <= range[END] and range[BEGIN] >= rightmost_match:
            result['range'] = type
            # TODO: Provide content of range too as convenience
            rightmost_match = index

    return result
