from .missing_element_base import MissingElementBase
from . import missing_embed
from . import missing_field
from . import missing_flag
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

    def embed(self, key=None):
        return missing_embed.MissingEmbed(key, self)

    def embeds(self, _key=None):
        return []
        
    def field(self, key=None):
        return missing_field.MissingField(key, self)

    def fields(self, _key=None):
        return []
    
    def flag(self, key=None):
        return missing_flag.MissingFlag(key, self)
        
    def flags(self, _key=None):
        return []
    
    def optional_element(self, _key=None):
        return None
        
    def optional_embed(self, _key=None):
        return None

    def optional_flag(self, _key=None):
        return None

    def optional_field(self, _key=None):
        return None

    def optional_section(self, _key=None):
        return None

    def required_element(self, _key=None):
        self._parent._missing_error(self)

    def required_embed(self, _key=None):
        self._parent._missing_error(self)

    def required_field(self, _key=None):
        self._parent._missing_error(self)

    def required_flag(self, _key=None):
        self._parent._missing_error(self)

    def required_section(self, _key=None):
        self._parent._missing_error(self)

    def section(self, key=None):
        return MissingSection(key, self)

    def sections(self, _key=None):
        return []
