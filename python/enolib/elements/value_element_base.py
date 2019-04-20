from ..errors.validation import Validation
from .element_base import ElementBase


class ValueElementBase(ElementBase):
    def _print_value(self):
        value = self._context.value(self._instruction)

        if not value:
            return 'None'

        if len(value) > 14:
            value = f"{value[0:11]}..."

        return value.replace("\n", '\n')

    def _value(self, loader=None, *, required):
        self._touched = True

        value = self._context.value(self._instruction)

        if value is None:
            if required:
                raise Validation.missing_value(self._context, self._instruction)
            else:
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

    def required_string_value(self):
        return self._value(required=True)

    def required_value(self, loader):
        return self._value(loader, required=True)

    def value_error(self, message):
        if callable(message):
            message = message(self._context.value(self._instruction))

        return Validation.value_error(self._context, message, self._instruction)
