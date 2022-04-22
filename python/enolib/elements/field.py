from ..errors.validation import Validation
from . import attribute as attribute_module
from . import item as item_module
from . import section
from .missing import missing_attribute
from .value_element_base import ValueElementBase


class Field(ValueElementBase):
    def __init__(self, context, instruction, parent=None):
        super().__init__(context, instruction, parent)

        self._all_attributes_required = parent._all_elements_required if parent else False
    
    def __repr__(self):
        if 'attributes' in self._instruction:
            return f"<class Field key={self._instruction['key']} attributes={len(self._attributes())}>"
        elif 'items' in self._instruction:
            return f"<class Field key={self._instruction['key']} items={len(self._items())}>"
        elif 'continuations' in self._instruction or 'value' in self._instruction:
            return f"<class Field key={self._instruction['key']} value={self._print_value()}>"
            
        return f"<class Field key={self._instruction['key']}>"

    def _attribute(self, key, *, required=None):
        self._touched = True

        if not key:
            attributes = self._attributes()
        else:
            attributes_map = self._attributes(True)
            attributes = attributes_map[key] if key in attributes_map else []

        if len(attributes) == 0:
            if required or required is None and self._all_attributes_required:
                raise Validation.missing_element(self._context, key, self._instruction, 'missing_attribute')
            elif required is None:
                return missing_attribute.MissingAttribute(key, self)
            else:
                return None

        if len(attributes) > 1:
            raise Validation.unexpected_multiple_elements(
                self._context,
                key,
                [e._instruction for e in attributes],
                'expected_single_attribute'
            )

        return attributes[0]

    def _attributes(self, as_map=False):
        if not hasattr(self, '_instantiated_attributes'):
            self._instantiated_attributes_map = {}
            
            if 'attributes' in self._instruction:
                def instantiate_and_index(attribute):
                    instance = attribute_module.Attribute(self._context, attribute, self)

                    if attribute['key'] in self._instantiated_attributes_map:
                        self._instantiated_attributes_map[attribute['key']].append(instance)
                    else:
                        self._instantiated_attributes_map[attribute['key']] = [instance]

                    return instance

                self._instantiated_attributes = [instantiate_and_index(attribute) for attribute in self._instruction['attributes']]
            else:
                self._instantiated_attributes = []

        return self._instantiated_attributes_map if as_map else self._instantiated_attributes

    def _items(self):
        if not hasattr(self, '_instantiated_items'):
            if 'items' in self._instruction:
                self._instantiated_items = [item_module.Item(self._context, item, self) for item in self._instruction['items']]
            else:
                self._instantiated_items = []

        return self._instantiated_items

    def _missing_error(self, attribute):
        raise Validation.missing_element(self._context, attribute._key, self._instruction, 'missing_attribute')

    def _untouched(self):
        if not hasattr(self, '_touched'):
            return self._instruction

        if 'attributes' in self._instruction:
            untouched_attribute = next((attribute for attribute in self._attributes() if not hasattr(attribute, '_touched')), None)
            if untouched_attribute:
                return untouched_attribute._instruction
        elif 'items' in self._instruction:
            untouched_item = next((item for item in self._items() if not hasattr(item, '_touched')), None)
            if untouched_item:
                return untouched_item._instruction
            
        return False
    
    def all_attributes_required(self, required=True):
        self._all_attributes_required = required

    def assert_all_touched(self, message=None, *, only=None, skip=None):
        attributes_map = self._attributes(True)

        for key, attributes in attributes_map.items():
            if (skip and key in skip) or (only and key not in only):
                continue

            for attribute in attributes:
                if not hasattr(attribute, '_touched'):
                    if callable(message):
                        message = message(attribute)

                    raise Validation.unexpected_element(self._context, message, attribute['instruction'])

    def attribute(self, key=None):
        return self._attribute(key)

    def attributes(self, key=None):
        self._touched = True
        
        if 'continuations' in self._instruction or 'items' in self._instruction or 'value' in self._instruction:
            raise Validation.unexpected_field_content(self._context, key, self._instruction, 'expected_attributes')

        if not key:
            return self._attributes()
        else:
            attributes_map = self._attributes(True)
            return attributes_map[key] if key in attributes_map else []

    def items(self):
        self._touched = True
        
        if 'attributes' in self._instruction or 'continuations' in self._instruction or 'value' in self._instruction:
            raise Validation.unexpected_field_content(self._context, None, self._instruction, 'expected_items')

        return self._items()

    def length(self):
        self._touched = True

        return len(self._items())

    def optional_attribute(self, key=None):
        return self._attribute(key, required=False)

    def optional_string_values(self):
        self._touched = True

        return [item.optional_string_value() for item in self._items()]
        
    def optional_values(self, loader):
        self._touched = True

        return [item.optional_value(loader) for item in self._items()]

    def parent(self):
        return self._parent or section.Section(self._context, self._instruction['parent'])

    def required_attribute(self, key=None):
        return self._attribute(key, required=True)
    
    def required_string_values(self):
        self._touched = True

        if 'attributes' in self._instruction or 'continuations' in self._instruction or 'value' in self._instruction:
            raise Validation.unexpected_field_content(self._context, key, self._instruction, 'expected_items')

        return [item.required_string_value() for item in self._items()]
        
    def required_values(self, loader):
        self._touched = True

        if 'attributes' in self._instruction or 'continuations' in self._instruction or 'value' in self._instruction:
            raise Validation.unexpected_field_content(self._context, key, self._instruction, 'expected_items')

        return [item.required_value(loader) for item in self._items()]        
        
    def touch(self):
        self._touched = True

        if 'attributes' in self._instruction:
            for attribute in self._attributes():
                attribute._touched = True
        elif 'items' in self._instruction:
            for item in self._items():
                item._touched = True
