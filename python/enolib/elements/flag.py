from .element_base import ElementBase
from . import section


class Flag(ElementBase):
    def __repr__(self):
        return f"<class Flag key={self._instruction['key']}>"

    def parent(self):
        return self._parent or section.Section(self._context, self._instruction.parent)
