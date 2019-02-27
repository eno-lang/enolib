from .missing_element_base import MissingElementBase

class MissingEmpty(MissingElementBase):
  def __repr__(self):
    f"<class MissingEmpty key={self._key}>" # TODO: Handle missing key
