from .missing_value_element_base import MissingValueElementBase

class MissingField(MissingValueElementBase):
  def __repr__(self):
    if self._key:
      return f"<class MissingField key={self._key}>"
    else:
      return '<class MissingField>'
