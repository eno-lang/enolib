from . import fieldset
from .value_element_base import ValueElementBase


class FieldsetEntry(ValueElementBase):
    def __repr__(self):
        return f"<class FieldsetEntry key={self._instruction['key']} value={self._print_value()}>"

    def parent(self):
        return self._parent or fieldset.Fieldset(self._context, self._instruction.parent)
