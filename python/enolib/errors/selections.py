from ..constants import (
    BEGIN,
    END,
    FIELD,
    FIELDSET,
    FIELDSET_ENTRY,
    LIST,
    LIST_ITEM,
    MULTILINE_FIELD_BEGIN,
    SECTION
)

DOCUMENT_BEGIN = {
    'from': { 'column': 0, 'index': 0, 'line': 0 },
    'to': { 'column': 0, 'index': 0, 'line': 0 }
}

def last_in(element):
    if ((element['type'] == FIELD or
         element['type'] == LIST_ITEM or
         element['type'] == FIELDSET_ENTRY) and 'continuations' in element):
        return element['continuations'][-1]
    elif element['type'] == LIST and 'items' in element:
        return last_in(element['items'][-1])
    elif element['type'] == FIELDSET and 'entries' in element:
        return last_in(element['entries'][-1])
    elif element['type'] == MULTILINE_FIELD_BEGIN:
        return element['end']
    elif element['type'] == SECTION and len(element['elements']) > 0:
        return last_in(element['elements'][-1])
    else:
        return element

def cursor(instruction, range, position):
    index = instruction['ranges'][range][position]

    return {
        'column': index - instruction['ranges']['line'][BEGIN],
        'index': index,
        'line': instruction['line']
    }

def selection(from_instruction, from_range, from_position, *to):
    to_instruction = next((argument for argument in to if isinstance(argument, dict)), from_instruction)
    to_range = next((argument for argument in to if isinstance(argument, str)), from_range)
    to_position = next((argument for argument in to if isinstance(argument, int)), from_position)

    return {
        'from': cursor(from_instruction, from_range, from_position),
        'to': cursor(to_instruction, to_range, to_position)
    }

def select_comments(element):
    comments = element['comments']

    if len(comments) == 1:
        if 'comment' in comments[0]:
            return selection(comments[0], 'comment', BEGIN, END)
        else:
            return selection(comments[0], 'line', BEGIN, END)
    elif len(comments) > 1:
        return selection(comments[0], 'line', BEGIN, comments[-1], 'line', END)
    else:
        return selection(element, 'line', BEGIN)

def select_element(element):
    return selection(element, 'line', BEGIN, last_in(element), 'line', END)

def select_key(element):
    return selection(element, 'key', BEGIN, END)

def select_line(element):
    return selection(element, 'line', BEGIN, END)

def select_template(element):
    return selection(element, 'template', BEGIN, END)
