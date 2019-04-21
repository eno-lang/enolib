from .missing_element_base import MissingElementBase
from . import missing_empty
from . import missing_field
from . import missing_fieldset
from . import missing_list
from . import missing_section_element

class MissingSection(MissingElementBase):
    def __repr__(self):
        if self._key:
            return f"<class MissingSection key={self._key}>"

        return '<class MissingSection>'

    def element(self, key=None):
        return missing_section_element.MissingSectionElement(key, self)

    def elements(self, _key=None):
        return []

    def empty(self, key=None):
        return missing_empty.MissingEmpty(key, self)

    def field(self, key=None):
        return missing_field.MissingField(key, self)

    def fields(self, _key=None):
        return []

    def fieldset(self, key=None):
        return missing_fieldset.MissingFieldset(key, self)

    def fieldsets(self, _key=None):
        return []

    def list(self, key=None):
        return missing_list.MissingList(key, self)

    def lists(self, _key=None):
        return []

    def optional_element(self, _key=None):
        return None

    def optional_empty(self, _key=None):
        return None

    def optional_field(self, _key=None):
        return None

    def optional_fieldset(self, _key=None):
        return None

    def optional_list(self, _key=None):
        return None

    def optional_section(self, _key=None):
        return None

    def required_element(self, _key=None):
        self._parent._missing_error(self)

    def required_empty(self, _key=None):
        self._parent._missing_error(self)

    def required_field(self, _key=None):
        self._parent._missing_error(self)

    def required_fieldset(self, _key=None):
        self._parent._missing_error(self)

    def required_list(self, _key=None):
        self._parent._missing_error(self)

    def required_section(self, _key=None):
        self._parent._missing_error(self)

    def section(self, key=None):
        return MissingSection(key, self)

    def sections(self, _key=None):
        return []
