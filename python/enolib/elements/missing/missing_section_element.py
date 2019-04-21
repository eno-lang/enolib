from .missing_element_base import MissingElementBase
from . import missing_empty
from . import missing_field
from . import missing_fieldset
from . import missing_list
from . import missing_section

class MissingSectionElement(MissingElementBase):
    def __repr__(self):
        if self._key:
            return f"<class MissingSectionElement key={self._key}>"

        return '<class MissingSectionElement>'

    def to_empty(self):
        return missing_empty.MissingEmpty(self._key, self._parent)

    def to_field(self):
        return missing_field.MissingField(self._key, self._parent)

    def to_fieldset(self):
        return missing_fieldset.MissingFieldset(self._key, self._parent)

    def to_list(self):
        return missing_list.MissingList(self._key, self._parent)

    def to_section(self):
        return missing_section.MissingSection(self._key, self._parent)

    def yields_empty(self):
        return True # TODO: here and below - raise instead?

    def yields_field(self):
        return True

    def yields_fieldset(self):
        return True

    def yields_list(self):
        return True

    def yields_section(self):
        return True
