from .missing_element_base import MissingElementBase

class MissingSectionElement(MissingElementBase):
    def __repr__(self):
        if self._key:
            return f"<class MissingSectionElement key={self._key}>"

        return '<class MissingSectionElement>'
