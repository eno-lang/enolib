from .missing_value_element_base import MissingValueElementBase
from .missing_attribute import MissingAttribute

class MissingField(MissingValueElementBase):
    def __repr__(self):
        if self._key:
            return f"<class MissingField key={self._key}>"

        return '<class MissingField>'

    def attribute(self, key=None):
        return MissingAttribute(key, self)
        
    def attributes(self, _key=None):
        return []

    def items(self):
        return []

    def optional_attribute(self, _key=None):
        return None
        
    def optional_string_values(self):
        return []

    def optional_values(self, _loader):
        return []

    def required_attribute(self, _key=None):
        self._parent._missing_error(self)

    def required_string_values(self):
        return []

    def required_values(self, _loader):
        return []
