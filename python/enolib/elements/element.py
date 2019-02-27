from ..constants import FIELDSET_ENTRY, LIST_ITEM
from ..errors.validation import Validation
from . import fieldset_entry
from . import list_item
from .section_element import SectionElement


class Element(SectionElement):
  # TODO: Revisit (also: missing in js implementation)
  def __repr__(self):
    return f"<class Element key={self._instruction['key']}>"

  def to_fieldset_entry(self):
    if not self._fieldset_entry:
      if self._instruction['type'] != FIELDSET_ENTRY:
        raise Validation.unexpected_element_type(self._context, None, self._instruction, 'expected_fieldset_entry')

      self._fieldset_entry = fieldset_entry.FieldsetEntry(self._context, self._instruction)

    return self._fieldset_entry

  def to_list_item(self):
    if not self._list_item:
      if self._instruction['type'] != LIST_ITEM:
        raise Validation.unexpected_element_type(self._context, None, self._instruction, 'expected_list_item')

      self._list_item = list_item.ListItem(self._context, self._instruction)

    return self._list_item

  def yields_fieldset_entry(self):
    return self._instruction['type'] == FIELDSET_ENTRY

  def yields_list_item(self):
    return self._instruction['type'] == LIST_ITEM
