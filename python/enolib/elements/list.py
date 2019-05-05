from . import list_item
from . import section
from .element_base import ElementBase


class List(ElementBase):
    def __repr__(self):
        return f"<class List key={self._instruction['key']} items={len(self._items())}>"

    def _instantiate_items(self, list):
        if 'mirror' in list:
            return self._instantiate_items(list['mirror'])
        elif 'extend' in list:
            return self._instantiate_items(list['extend']) + [list_item.ListItem(self._context, item, self) for item in list['items']]
        elif 'items' in list:
            return [list_item.ListItem(self._context, item, self) for item in list['items']]
        else:
            return []

    def _items(self):
        if not hasattr(self, '_instantiated_items'):
            self._instantiated_items = self._instantiate_items(self._instruction)

        return self._instantiated_items

    def _untouched(self):
        if not hasattr(self, '_touched'):
            return self._instruction

        untouched_item = next((item for item in self._items() if not hasattr(item, '_touched')), None)

        return untouched_item._instruction if untouched_item else False

    def items(self):
        self._touched = True

        return self._items()

    def length(self):
        self._touched = True

        return len(self._items())

    def optional_string_values(self):
        self._touched = True

        return [item.optional_string_value() for item in self._items()]

    def optional_values(self, loader):
        self._touched = True

        return [item.optional_value(loader) for item in self._items()]

    def parent(self):
        return self._parent or section.Section(self._context, self._instruction['parent'])

    def required_string_values(self):
        self._touched = True

        return [item.required_string_value() for item in self._items()]

    def required_values(self, loader):
        self._touched = True

        return [item.required_value(loader) for item in self._items()]

    def touch(self):
        self._touched = True

        for item in self._items():
            item._touched = True
