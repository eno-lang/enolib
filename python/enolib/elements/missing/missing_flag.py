from .missing_element_base import MissingElementBase

class MissingFlag(MissingElementBase):
    def __repr__(self):
        if self._key:
            return f"<class MissingFlag key={self._key}>"

        return '<class MissingFlag>'
