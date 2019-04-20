class MissingElementBase:
    def __init__(self, key, parent):
        self._key = key
        self._parent = parent

    def _missing_error(self, _element):
        self._parent._missing_error(self)

    def key(self, _loader):
        self._parent._missing_error(self)

    def optional_comment(self, _loader):
        return None

    def optional_string_comment(self):
        return None

    def raw(self):
        return None

    def required_comment(self, _loader):
        self._parent._missing_error(self)

    def required_string_comment(self):
        self._parent._missing_error(self)

    def string_key(self):
        self._parent._missing_error(self)
