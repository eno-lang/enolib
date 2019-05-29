from ..constants import DOCUMENT, FIELDSET_ENTRY, LIST_ITEM
from ..errors.validation import Validation
from . import fieldset_entry
from . import list_item
from .section_element import SectionElement

class Element(SectionElement):
    def __repr__(self):
        return f"<class Element key={self._key()} yields={self._yields()}>"

    def to_document(self):
        if self._instruction['type'] != DOCUMENT:
            raise Validation.unexpected_element_type(self._context, None, self._instruction, 'expected_document')

        if not hasattr(self, '_section'):
            self._section = section.Section(self._context, self._instruction)
            self._yielded = SECTION

        return self._section

    def to_fieldset_entry(self):
        if not hasattr(self, '_fieldset_entry'):
            if self._instruction['type'] != FIELDSET_ENTRY:
                raise Validation.unexpected_element_type(self._context, None, self._instruction, 'expected_fieldset_entry')

            self._fieldset_entry = fieldset_entry.FieldsetEntry(self._context, self._instruction)

        return self._fieldset_entry

    def to_list_item(self):
        if not hasattr(self, '_list_item'):
            if self._instruction['type'] != LIST_ITEM:
                raise Validation.unexpected_element_type(self._context, None, self._instruction, 'expected_list_item')

            self._list_item = list_item.ListItem(self._context, self._instruction)

        return self._list_item

    def to_section(self):
        if not hasattr(self, '_section'):
            if self._instruction['type'] != SECTION and self._instruction['type'] != DOCUMENT:
                raise Validation.unexpected_element_type(self._context, None, self._instruction, 'expected_section')

            self._section = section.Section(self._context, self._instruction)
            self._yielded = SECTION

        return self._section

    def yields_document(self):
        return self._instruction['type'] == DOCUMENT

    def yields_fieldset_entry(self):
        return self._instruction['type'] == FIELDSET_ENTRY

    def yields_list_item(self):
        return self._instruction['type'] == LIST_ITEM

    def yields_section(self):
        return (self._instruction['type'] == SECTION or
                self._instruction['type'] == DOCUMENT)
