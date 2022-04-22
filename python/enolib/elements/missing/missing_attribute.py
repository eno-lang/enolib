from .missing_value_element_base import MissingValueElementBase

class MissingAttribute(MissingValueElementBase):
    def __repr__(self):
        if self._key:
            return f"<class MissingAttribute key={self._key}>"

        return '<class MissingAttribute>'
