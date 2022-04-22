from .element_base import ElementBase

class Element(ElementBase):
    def __repr__(self):
        return f"<class Element key={self._key()}>"