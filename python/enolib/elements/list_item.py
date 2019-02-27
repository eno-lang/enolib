from . import list
from .value_element_base import ValueElementBase


class ListItem(ValueElementBase):
  def __repr__(self):
    return f"<class ListItem value={self._print_value()}>"

  def parent(self):
    return self._parent or list.List(self._context, self._instruction.parent)
