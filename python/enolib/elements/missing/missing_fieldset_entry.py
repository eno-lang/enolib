from .missing_value_element_base import MissingValueElementBase

class MissingFieldsetEntry(MissingValueElementBase):
    def __repr__(self):
        if self._key:
            return f"<class MissingFieldsetEntry key={self._key}>"

        return '<class MissingFieldsetEntry>'
