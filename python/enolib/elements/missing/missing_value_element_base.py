from .missing_element_base import MissingElementBase

class MissingValueElementBase(MissingElementBase):
    def optional_string_value(self):
        return None

    def optional_value(self, _loader):
        return None

    def required_string_value(self):
        self._parent._missing_error(self)

    def required_value(self, _loader):
        self._parent._missing_error(self)
