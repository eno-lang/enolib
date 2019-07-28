# Added to 0-indexed indices in a few places
HUMAN_INDEXING = 1

# Selection indices
BEGIN = 0
END = 1

# Instruction types
COMMENT = 'Comment'
CONTINUATION = 'Continuation'
DOCUMENT = 'Document'
EMPTY = 'Empty'
FIELD = 'Field'
FIELDSET = 'Fieldset'
FIELDSET_ENTRY = 'Fieldset Entry'
FIELD_OR_FIELDSET_OR_LIST = 'Field, Fieldset or List'
LIST = 'List'
LIST_ITEM = 'List Item'
MULTILINE_FIELD_BEGIN = 'Multiline Field Begin'
MULTILINE_FIELD_END = 'Multiline Field End'
MULTILINE_FIELD_VALUE = 'Multiline Field Value'
SECTION = 'Section'
UNPARSED = 'Unparsed'

PRETTY_TYPES = {
    DOCUMENT: 'document',
    EMPTY: 'empty',
    FIELD: 'field',
    FIELDSET: 'fieldset',
    FIELDSET_ENTRY: 'fieldset_entry',
    FIELD_OR_FIELDSET_OR_LIST: 'field_or_fieldset_or_list',
    LIST: 'list',
    LIST_ITEM: 'list_item',
    MULTILINE_FIELD_BEGIN: 'field',
    SECTION: 'section'
}
