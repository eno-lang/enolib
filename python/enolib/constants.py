# Added to 0-indexed indices in a few places
HUMAN_INDEXING = 1

# Selection indices
BEGIN = 0
END = 1

# Instruction types
COMMENT = 'Comment'
CONTINUATION = 'Continuation'
DOCUMENT = 'Document'
EMPTY_ELEMENT = 'Empty Element'
FIELD = 'Field'
FIELDSET = 'Fieldset'
FIELDSET_ENTRY = 'Fieldset Entry'
LIST = 'List'
LIST_ITEM = 'List Item'
MULTILINE_FIELD_BEGIN = 'Multiline Field Begin'
MULTILINE_FIELD_END = 'Multiline Field End'
MULTILINE_FIELD_VALUE = 'Multiline Field Value'
SECTION = 'Section'
UNPARSED = 'Unparsed'

PRETTY_TYPES = {
    DOCUMENT: 'document',
    EMPTY_ELEMENT: 'empty_element',
    FIELD: 'field',
    FIELDSET: 'fieldset',
    FIELDSET_ENTRY: 'fieldset_entry',
    LIST: 'list',
    LIST_ITEM: 'list_item',
    MULTILINE_FIELD_BEGIN: 'field',
    SECTION: 'section'
}
