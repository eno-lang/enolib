from .missing_value_element_base import MissingValueElementBase

class MissingFieldsetEntry(MissingValueElementBase):
  def __repr__(self):
    f"<class MissingFieldsetEntry key={self._key}>" # TODO: Handle missing key
