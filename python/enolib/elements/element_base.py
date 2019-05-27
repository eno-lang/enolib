from ..errors.validation import Validation
from ..constants import DOCUMENT, LIST_ITEM

class ElementBase:
    def __init__(self, context, instruction, parent=None):
        self._context = context
        self._instruction = instruction
        self._parent = parent  # TODO: Could be set optionally as well (needs hasattr checks everywhere then)

    def _comment(self, loader=None, *, required):
        self._touched = True

        comment = self._context.comment(self._instruction)

        if not comment:
            if required:
                raise Validation.missing_comment(self._context, self._instruction)
            else:
                return None

        if not loader:
            return comment

        try:
            return loader(comment)
        except ValueError as message:
            raise Validation.comment_error(self._context, message, self._instruction)

    def _key(self):
        if self._instruction['type'] is DOCUMENT:
            return None

        if self._instruction['type'] is LIST_ITEM:
            return self._instruction['parent']['key']

        return self._instruction['key']

    def comment_error(self, message):
        if callable(message):
            message = message(self._context.comment(self._instruction))

        return Validation.comment_error(self._context, message, self._instruction)

    def error(self, message):
        if callable(message):
            message = message(self)  # Revisit self in this context - problematic

        return Validation.element_error(self._context, message, self._instruction)

    def key(self, loader):
        self._touched = True

        try:
            return loader(self._key())
        except ValueError as message:
            raise Validation.key_error(self._context, message, self._instruction)

    def key_error(self, message):
        if callable(message):
            message = message(self._key())

        return Validation.key_error(self._context, message, self._instruction)

    def optional_comment(self, loader):
        return self._comment(loader, required=False)

    def optional_string_comment(self):
        return self._comment(required=False)

    def raw(self):
        return self._context.raw(self._instruction)

    def required_comment(self, loader):
        return self._comment(loader, required=True)

    def required_string_comment(self):
        return self._comment(required=True)

    def string_key(self):
        self._touched = True

        return self._key()

    def touch(self):
        self._touched = True
