from ..errors.validation import Validation
from . import section
from .value_element_base import ValueElementBase


class Field(ValueElementBase):
    def __repr__(self):
        return f"<class Field key={self._instruction['key']} value={self._print_value()}>"

    def _value(self, loader=None, *, required):
        self._touched = True

        value = self._context.value(self._instruction)

        if value is None:
            if required:
                raise Validation.missing_value(self._context, self._instruction)

            return None

        # TODO: Check if ValueError is 1) a valid pythonic approach 2) the best choice

        if not loader:
            return value

        try:
            return loader(value)
        except ValueError as message:
            raise Validation.value_error(self._context, message, self._instruction)


    def optional_string_value(self):
        return self._value(required=False)

    def optional_value(self, loader):
        return self._value(loader, required=False)

    def parent(self):
        return self._parent or section.Section(self._context, self._instruction.parent)

    def required_string_value(self):
        return self._value(required=True)

    def required_value(self, loader):
        return self._value(loader, required=True)
