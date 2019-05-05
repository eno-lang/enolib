from .missing_element_base import MissingElementBase
from .missing_fieldset_entry import MissingFieldsetEntry

class MissingFieldset(MissingElementBase):
    def __repr__(self):
        if self._key:
            return f"<class MissingFieldset key={self._key}>"

        return '<class MissingFieldset>'

    def entries(self, _key=None):
        return []

    def entry(self, key=None):
        return MissingFieldsetEntry(key, self)

    def optional_entry(self, _key=None):
        return None

    def required_entry(self, _key=None):
        self._parent._missing_error(self)
