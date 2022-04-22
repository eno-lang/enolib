from . import field
from .value_element_base import ValueElementBase


class Attribute(ValueElementBase):
    def __repr__(self):
        return f"<class Attribute key={self._instruction['key']} value={self._print_value()}>"

    def parent(self):
        return self._parent or field.Field(self._context, self._instruction.parent)
