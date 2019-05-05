from .missing_element_base import MissingElementBase

class MissingEmpty(MissingElementBase):
    def __repr__(self):
        if self._key:
            return f"<class MissingEmpty key={self._key}>"

        return '<class MissingEmpty>'
