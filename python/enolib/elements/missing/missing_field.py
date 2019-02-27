from .missing_value_element_base import MissingValueElementBase

class MissingField(MissingValueElementBase):
  def __repr__(self):
    f"<class MissingField key={self._key}>" # TODO: Handle missing key
