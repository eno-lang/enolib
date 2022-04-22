from . import section
from .value_element_base import ValueElementBase


class Embed(ValueElementBase):
    def __repr__(self):
        return f"<class Embed key={self._instruction['key']} value={self._print_value()}>"

    def parent(self):
        return self._parent or section.Section(self._context, self._instruction['parent'])
