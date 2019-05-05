from . import list as list_module  # don't globally override built-in list function
from .value_element_base import ValueElementBase


class ListItem(ValueElementBase):
    def __repr__(self):
        return f"<class ListItem value={self._print_value()}>"

    def parent(self):
        return self._parent or list_module.List(self._context, self._instruction.parent)
