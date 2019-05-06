# Added to 0-indexed indices in a few places
from enum import Enum

HUMAN_INDEXING = 1

# Selection indices
BEGIN = 0
END = 1

# Instruction types
class InstructionType(Enum):
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

    def pretty(self):
        return {
            InstructionType.DOCUMENT: 'document',
            InstructionType.EMPTY_ELEMENT: 'empty_element',
            InstructionType.FIELD: 'field',
            InstructionType.FIELDSET: 'fieldset',
            InstructionType.FIELDSET_ENTRY: 'fieldset_entry',
            InstructionType.LIST: 'list',
            InstructionType.LIST_ITEM: 'list_item',
            InstructionType.MULTILINE_FIELD_BEGIN: 'field',
            InstructionType.SECTION: 'section'
        }.get(self)
