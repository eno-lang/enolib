from ..errors.validation import Validation
from . import empty
from . import field
from . import fieldset
from . import list as list_module  # don't globally override built-in list function
from . import section
from .element_base import ElementBase
from ..constants import (
    EMPTY_ELEMENT,
    FIELD,
    FIELDSET,
    LIST,
    MULTILINE_FIELD_BEGIN,
    PRETTY_TYPES,
    SECTION
)

class SectionElement(ElementBase):
    def __repr__(self):
        return f"<class SectionElement key={self._key()} yields={self._yields()}>"

    def _yields(self):
        if self._instruction['type'] == EMPTY_ELEMENT:
            return f"{PRETTY_TYPES[EMPTY_ELEMENT]},{PRETTY_TYPES[FIELD]},{PRETTY_TYPES[FIELDSET]},{PRETTY_TYPES[LIST]}"

        return PRETTY_TYPES[self._instruction['type']]

    def _untouched(self):
        if not hasattr(self, '_yielded'):
            return self._instruction

        if hasattr(self, '_empty') and not hasattr(self._empty, '_touched'):
            return self._instruction

        if hasattr(self, '_field') and not hasattr(self._field, '_touched'):
            return self._instruction

        if hasattr(self, '_fieldset'):
            return self._fieldset._untouched()

        if hasattr(self, '_list'):
            return self._list._untouched()

        if hasattr(self, '_section'):
            return self._section._untouched()

    def to_empty(self):
        if not hasattr(self, '_empty'):
            if hasattr(self, '_yielded'):
                raise TypeError(f"This element was already yielded as {PRETTY_TYPES[self._yielded]} and can't be yielded again as an empty.")

            if self._instruction['type'] != EMPTY_ELEMENT:
                raise Validation.unexpected_element_type(self._context, None, self._instruction, 'expected_empty')

            self._empty = empty.Empty(self._context, self._instruction, self._parent)
            self._yielded = EMPTY_ELEMENT

        return self._empty

    def to_field(self):
        if not hasattr(self, '_field'):
            if hasattr(self, '_yielded'):
                raise TypeError(f"This element was already yielded as {PRETTY_TYPES[self._yielded]} and can't be yielded again as a field.")

            if (self._instruction['type'] != FIELD and
                self._instruction['type'] != MULTILINE_FIELD_BEGIN and
                self._instruction['type'] != EMPTY_ELEMENT):
                raise Validation.unexpected_element_type(self._context, None, self._instruction, 'expected_field')

            self._field = field.Field(self._context, self._instruction, self._parent)
            self._yielded = FIELD

        return self._field

    def to_fieldset(self):
        if not hasattr(self, '_fieldset'):
            if hasattr(self, '_yielded'):
                raise TypeError(f"This element was already yielded as {PRETTY_TYPES[self._yielded]} and can't be yielded again as a fieldset.")

            if self._instruction['type'] != FIELDSET and self._instruction['type'] != EMPTY_ELEMENT:
                raise Validation.unexpected_element_type(self._context, None, self._instruction, 'expected_fieldset')

            self._fieldset = fieldset.Fieldset(self._context, self._instruction, self._parent)
            self._yielded = FIELDSET

        return self._fieldset

    def to_list(self):
        if not hasattr(self, '_list'):
            if hasattr(self, '_yielded'):
                raise TypeError(f"This element was already yielded as {PRETTY_TYPES[self._yielded]} and can't be yielded again as a list.")

            if self._instruction['type'] != LIST and self._instruction['type'] != EMPTY_ELEMENT:
                raise Validation.unexpected_element_type(self._context, None, self._instruction, 'expected_list')

            self._list = list_module.List(self._context, self._instruction, self._parent)
            self._yielded = LIST

        return self._list

    def to_section(self):
        if not hasattr(self, '_section'):
            if self._instruction['type'] != SECTION:
                raise Validation.unexpected_element_type(self._context, None, self._instruction, 'expected_section')

            self._section = section.Section(self._context, self._instruction, self._parent)
            self._yielded = SECTION

        return self._section

    def touch(self):
        # TODO: Here and elsewhere: This needs to touch anyway; possibly not so small implications
        if not hasattr(self, '_yielded'):
            return

        if hasattr(self, '_empty'):
            self._empty._touched = True

        if hasattr(self, '_field'):
            self._field._touched = True

        if hasattr(self, '_fieldset'):
            self._fieldset.touch()

        if hasattr(self, '_list'):
            self._list.touch()

        if hasattr(self, '_section'):
            self._section.touch()

    def yields_empty(self):
        return self._instruction['type'] == EMPTY_ELEMENT

    def yields_field(self):
        return (self._instruction['type'] == FIELD or
                self._instruction['type'] == MULTILINE_FIELD_BEGIN or
                self._instruction['type'] == EMPTY_ELEMENT)

    def yields_fieldset(self):
        return (self._instruction['type'] == FIELDSET or
                self._instruction['type'] == EMPTY_ELEMENT)

    def yields_list(self):
        return (self._instruction['type'] == LIST or
                self._instruction['type'] == EMPTY_ELEMENT)

    def yields_section(self):
        return self._instruction['type'] == SECTION
