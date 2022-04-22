from .context import Context
from .elements.element import Element
from .constants import (
    BEGIN,
    EMBED_BEGIN,
    END,
    FIELD,
    SECTION
)

def check_embed_by_line(field, line):
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

def check_embed_by_index(field, index):
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

    if 'attributes' in field:
        if line <= field['attributes'][-1]['line']:
            for attribute in field['attributes']:
                if line == attribute['line']:
                    return { 'element': attribute, 'instruction': attribute }

                if line < attribute['line']:
                    if 'comments' in attribute and line >= attribute['comments'][0]['line']:
                        for comment in attribute['comments']:
                            if line == comment['line']:
                                return { 'element': attribute, 'instruction': comment }

                    return { 'element': field, 'instruction': None }

                match_in_attribute = check_field_by_line(attribute, line) # TODO: check_attribute kinda really, although technically this works for now

                if match_in_attribute:
                    return match_in_attribute
    elif 'continuations' in field:
        if line <= field['continuations'][-1]['line']:
            for continuation in field['continuations']:
                if line == continuation['line']:
                    return { 'element': field, 'instruction': continuation }
                if line < continuation['line']:
                    return { 'element': field, 'instruction': None }
    elif 'items' in field:
        if line <= field['items'][-1]['line']:
            for item in field['items']:
                if line == item['line']:
                    return { 'element': item, 'instruction': item }

                if line < item['line']:
                    if 'comments' in item and line >= item['comments'][0]['line']:
                        for comment in item['comments']:
                            if line == comment['line']:
                                return { 'element': item, 'instruction': comment }

                    return { 'element': field, 'instruction': None }

                match_in_item = check_field_by_line(item, line)

                if match_in_item:
                    return match_in_item

    return False

def check_field_by_index(field, index):
    if index < field['ranges']['line'][BEGIN]:
        return False

    if index <= field['ranges']['line'][END]:
        return { 'element': field, 'instruction': field }

    if 'attributes' in field:
        if index <= field['attributes'][-1]['ranges']['line'][END]:
            for attribute in field['attributes']:
                if index < attribute['ranges']['line'][BEGIN]:
                    if 'comments' in attribute and index >= attribute['comments'][0]['ranges']['line'][BEGIN]:
                        for comment in attribute['comments']:
                            if index <= comment['ranges']['line'][END]:
                                return { 'element': attribute, 'instruction': comment }

                    return { 'element': field, 'instruction': None }

                if index <= attribute['ranges']['line'][END]:
                    return { 'element': attribute, 'instruction': attribute }

                match_in_attribute = check_field_by_index(attribute, index)

                if match_in_attribute:
                    return match_in_attribute
    elif 'continuations' in field:
        if index <= field['continuations'][-1]['ranges']['line'][END]:
            for continuation in field['continuations']:
                if index < continuation['ranges']['line'][BEGIN]:
                    return { 'element': field, 'instruction': None }
                if index <= continuation['ranges']['line'][END]:
                    return { 'element': field, 'instruction': continuation }
    elif 'items' in field:
        if index <= field['items'][-1]['ranges']['line'][END]:
            for item in field['items']:
                if index < item['ranges']['line'][BEGIN]:
                    if 'comments' in item and index >= item['comments'][0]['ranges']['line'][BEGIN]:
                        for comment in item['comments']:
                            if index <= comment['ranges']['line'][END]:
                                return { 'element': item, 'instruction': comment }

                    return { 'element': field, 'instruction': None }

                if index <= item['ranges']['line'][END]:
                    return { 'element': item, 'instruction': item }

                match_in_item = check_field_by_index(item, index)

                if match_in_item:
                    return match_in_item

    return False

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
        elif element['type'] is EMBED_BEGIN:
            match_in_embed = check_embed_by_line(element, line)
            if match_in_embed:
                return match_in_embed
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
        elif element['type'] is EMBED_BEGIN:
            match_in_embed = check_embed_by_index(element, index)
            if match_in_embed:
                return match_in_embed
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
