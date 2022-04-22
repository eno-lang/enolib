from .missing_value_element_base import MissingValueElementBase

class MissingEmbed(MissingValueElementBase):
    def __repr__(self):
        if self._key:
            return f"<class MissingEmbed key={self._key}>"

        return '<class MissingEmbed>'
