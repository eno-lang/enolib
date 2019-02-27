from .missing_element_base import MissingElementBase

class MissingList(MissingElementBase):
  def __repr__(self):
    f"<class MissingList key={self._key}>" # TODO: Handle missing key

  def items(self):
    return []

  def optional_string_values(self):
    return []

  def optional_values(self, _loader):
    return []

  def required_string_values(self):
    return []

  def required_values(self, _loader):
    return []
