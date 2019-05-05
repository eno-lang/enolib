from ..errors.validation import Validation
from . import element as element_module, section_element
from .element_base import ElementBase
from .missing import missing_empty
from .missing import missing_field
from .missing import missing_fieldset
from .missing import missing_list
from .missing import missing_section
from .missing import missing_section_element
from ..constants import (
    DOCUMENT,
    EMPTY_ELEMENT,
    FIELD,
    FIELDSET,
    LIST,
    MULTILINE_FIELD_BEGIN,
    SECTION
)

class Section(ElementBase):
    def __init__(self, context, instruction, parent=None):
        super().__init__(context, instruction, parent)

        self._all_elements_required = parent._all_elements_required if parent else False

    def __repr__(self):
        if self._instruction['type'] == DOCUMENT:
            return f"<class Section document elements={len(self._elements())}>"

        return f"<class Section key=\"{self._instruction['key']}\" elements={len(self._elements())}>"

    def _element(self, key, *, required=None):
        self._touched = True

        if not key:
            elements = self._elements()
        else:
            elements_map = self._elements(True)
            elements = elements_map[key] if key in elements_map else []

        if len(elements) == 0:
            if required or self._all_elements_required:
                raise Validation.missing_element(self._context, key, self._instruction, 'missing_element')
            elif required is None:
                return missing_section_element.MissingSectionElement(key, self)
            else:
                return None

        if len(elements) > 1:
            raise Validation.unexpected_multiple_elements(
                self._context,
                key,
                [element._instruction for element in elements],
                'expected_single_element'
            )

        return elements[0]

    def _elements(self, as_map=False):
        if not hasattr(self, '_instantiated_elements'):
            self._instantiated_elements = []
            self._instantiated_elements_map = {}
            self._instantiate_elements(self._instruction)

        return self._instantiated_elements_map if as_map else self._instantiated_elements

    def _empty(self, key, *, required=None):
        self._touched = True

        if not key:
            elements = self._elements()
        else:
            elements_map = self._elements(True)
            elements = elements_map[key] if key in elements_map else []

        if len(elements) == 0:
            if required or self._all_elements_required:
                raise Validation.missing_element(self._context, key, self._instruction, 'missing_empty')
            elif required is None:
                return missing_empty.MissingEmpty(key, self)
            else:
                return None

        if len(elements) > 1:
            raise Validation.unexpected_multiple_elements(
                self._context,
                key,
                [element._instruction for element in elements],
                'expected_single_empty'
            )

        element = elements[0]

        if element._instruction['type'] != EMPTY_ELEMENT:
            raise Validation.unexpected_element_type(self._context, key, element._instruction, 'expected_empty')

        return element.to_empty()

    def _field(self, key, *, required=None):
        self._touched = True

        if not key:
            elements = self._elements()
        else:
            elements_map = self._elements(True)
            elements = elements_map[key] if key in elements_map else []

        if len(elements) == 0:
            if required or self._all_elements_required:
                raise Validation.missing_element(self._context, key, self._instruction, 'missing_field')
            elif required is None:
                return missing_field.MissingField(key, self)
            else:
                return None

        if len(elements) > 1:
            raise Validation.unexpected_multiple_elements(
                self._context,
                key,
                [element._instruction for element in elements],
                'expected_single_field'
            )

        element = elements[0]

        if (element._instruction['type'] != FIELD and
            element._instruction['type'] != MULTILINE_FIELD_BEGIN and
            element._instruction['type'] != EMPTY_ELEMENT):
            raise Validation.unexpected_element_type(self._context, key, element._instruction, 'expected_field')

        return element.to_field()

    def _fieldset(self, key, *, required=None):
        self._touched = True

        if not key:
            elements = self._elements()
        else:
            elements_map = self._elements(True)
            elements = elements_map[key] if key in elements_map else []

        if len(elements) == 0:
            if required or self._all_elements_required:
                raise Validation.missing_element(self._context, key, self._instruction, 'missing_fieldset')
            elif required is None:
                return missing_fieldset.MissingFieldset(key, self)
            else:
                return None

        if len(elements) > 1:
            raise Validation.unexpected_multiple_elements(
                self._context,
                key,
                [element._instruction for element in elements],
                'expected_single_fieldset'
            )

        element = elements[0]

        if element._instruction['type'] != FIELDSET and element._instruction['type'] != EMPTY_ELEMENT:
            raise Validation.unexpected_element_type(self._context, key, element._instruction, 'expected_fieldset')

        return element.to_fieldset()

    def _instantiate_elements(self, section):
        if 'mirror' in section:
            self._instantiate_elements(section['mirror'])
        else:
            def instantiate_and_index(element):
                instance = section_element.SectionElement(self._context, element, self)

                if element['key'] in self._instantiated_elements_map:
                    self._instantiated_elements_map[element['key']].append(instance)
                else:
                    self._instantiated_elements_map[element['key']] = [instance]

                return instance

            filtered = [element for element in section['elements'] if element['key'] not in self._instantiated_elements_map]
            self._instantiated_elements.extend(instantiate_and_index(element) for element in filtered)  # TODO: Probably needs to come AFTER 'if 'extend' in section:' below because otherwise the order is incorrect?

            if 'extend' in section:
                self._instantiate_elements(section['extend'])

    def _list(self, key, *, required=None):
        self._touched = True

        if not key:
            elements = self._elements()
        else:
            elements_map = self._elements(True)
            elements = elements_map[key] if key in elements_map else []

        if len(elements) == 0:
            if required or self._all_elements_required:
                raise Validation.missing_element(self._context, key, self._instruction, 'missing_list')
            elif required is None:
                return missing_list.MissingList(key, self)
            else:
                return None

        if len(elements) > 1:
            raise Validation.unexpected_multiple_elements(
                self._context,
                key,
                [element._instruction for element in elements],
                'expected_single_list'
            )

        element = elements[0]

        if element._instruction['type'] != LIST and element._instruction['type'] != EMPTY_ELEMENT:
            raise Validation.unexpected_element_type(self._context, key, element._instruction, 'expected_list')

        return element.to_list()

    def _missing_error(self, element):
        if isinstance(element, missing_field.MissingField):
            raise Validation.missing_element(self._context, element._key, self._instruction, 'missing_field')
        elif isinstance(element, missing_fieldset.MissingFieldset):
            raise Validation.missing_element(self._context, element._key, self._instruction, 'missing_fieldset')
        elif isinstance(element, missing_list.MissingList):
            raise Validation.missing_element(self._context, element._key, self._instruction, 'missing_list')
        elif isinstance(element, missing_section.MissingSection):
            raise Validation.missing_element(self._context, element._key, self._instruction, 'missing_section')
        else:
            raise Validation.missing_element(self._context, element._key, self._instruction, 'missing_element')

    def _section(self, key, *, required=None):
        self._touched = True

        if not key:
            elements = self._elements()
        else:
            elements_map = self._elements(True)
            elements = elements_map[key] if key in elements_map else []

        if len(elements) == 0:
            if required or self._all_elements_required:
                raise Validation.missing_element(self._context, key, self._instruction, 'missing_section')
            elif required is None:
                return missing_section.MissingSection(key, self)
            else:
                return None

        if len(elements) > 1:
            raise Validation.unexpected_multiple_elements(
                self._context,
                key,
                [element._instruction for element in elements],
                'expected_single_section'
            )

        element = elements[0]

        if element._instruction['type'] != SECTION:
            raise Validation.unexpected_element_type(self._context, key, element._instruction, 'expected_section')

        return element.to_section()

    def _untouched(self):
        if not hasattr(self, '_touched'):
            return self._instruction

        for element in self._elements():
            untouched_element = element._untouched()
            if untouched_element:
                return untouched_element

        return False

    def all_elements_required(self, required=True):
        self._all_elements_required = required

        for element in self._elements():
            if element._instruction['type'] == SECTION and element._yielded:
                element.to_section().all_elements_required(required)
            elif element._instruction['type'] == FIELDSET and element._yielded:
                element.to_fieldset().all_entries_required(required)

    def assert_all_touched(self, message=None, *, only=None, skip=None):
        elements_map = self._elements(True)

        for key, elements in elements_map.items():
            if (skip and key in skip) or (only and key not in only):
                continue

            for element in elements:
                untouched = element._untouched()

                if untouched:
                    if callable(message):
                        message = message(element_module.Element(self._context, untouched, self))

                    raise Validation.unexpected_element(self._context, message, untouched)

    def element(self, key=None):
        return self._element(key)

    def elements(self, key=None):
        self._touched = True

        if key:
            elements_map = self._elements(True)
            return elements_map[key] if key in elements_map else []

        return self._elements()

    def empty(self, key=None):
        return self._empty(key)

    def field(self, key=None):
        return self._field(key)

    def fields(self, key=None):
        self._touched = True

        if not key:
            elements = self._elements()
        else:
            elements_map = self._elements(True)
            elements = elements_map[key] if key in elements_map else []

        def cast(element):
            if (element._instruction['type'] != FIELD and
                element._instruction['type'] != MULTILINE_FIELD_BEGIN and
                element._instruction['type'] != EMPTY_ELEMENT):
                raise Validation.unexpected_element_type(self._context, key, element._instruction, 'expected_fields')

            return element.to_field()

        return [cast(element) for element in elements]

    def fieldset(self, key=None):
        return self._fieldset(key)

    def fieldsets(self, key=None):
        self._touched = True

        if not key:
            elements = self._elements()
        else:
            elements_map = self._elements(True)
            elements = elements_map[key] if key in elements_map else []

        def cast(element):
            if element._instruction['type'] != FIELDSET and element._instruction['type'] != EMPTY_ELEMENT:
                raise Validation.unexpected_element_type(self._context, key, element._instruction, 'expected_fieldsets')

            return element.to_fieldset()

        return [cast(element) for element in elements]

    def list(self, key=None):
        return self._list(key)

    def lists(self, key=None):
        self._touched = True

        if not key:
            elements = self._elements()
        else:
            elements_map = self._elements(True)
            elements = elements_map[key] if key in elements_map else []

        def cast(element):
            if element._instruction['type'] != LIST and element._instruction['type'] != EMPTY_ELEMENT:
                raise Validation.unexpected_element_type(self._context, key, element._instruction, 'expected_lists')

            return element.to_list()

        return [cast(element) for element in elements]

    def optional_element(self, key):
        return self._element(key, required=False)

    def optional_empty(self, key):
        return self._empty(key, required=False)

    def optional_field(self, key):
        return self._field(key, required=False)

    def optional_fieldset(self, key):
        return self._fieldset(key, required=False)

    def optional_list(self, key):
        return self._list(key, required=False)

    def optional_section(self, key):
        return self._section(key, required=False)

    def parent(self):
        if self._instruction['type'] == DOCUMENT:
            return None

        return self._parent or Section(self._context, self._instruction['parent'])

    def required_element(self, key=None):
        return self._element(key, required=True)

    def required_empty(self, key=None):
        return self._empty(key, required=True)

    def required_field(self, key=None):
        return self._field(key, required=True)

    def required_fieldset(self, key=None):
        return self._fieldset(key, required=True)

    def required_list(self, key=None):
        return self._list(key, required=True)

    def required_section(self, key=None):
        return self._section(key, required=True)

    def section(self, key=None):
        return self._section(key)

    def sections(self, key=None):
        self._touched = True

        if not key:
            elements = self._elements()
        else:
            elements_map = self._elements(True)
            elements = elements_map[key] if key in elements_map else []

        def cast(element):
            if element._instruction['type'] != SECTION:
                raise Validation.unexpected_element_type(self._context, key, element._instruction, 'expected_sections')

            return element.to_section()

        return [cast(element) for element in elements]

    def touch(self):
        self._touched = True

        for element in self._elements():
            element.touch()
