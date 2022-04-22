from ..errors.validation import Validation
from . import element as element_module
from . import embed
from . import field
from . import flag
from .element_base import ElementBase
from .missing import missing_embed
from .missing import missing_field
from .missing import missing_flag
from .missing import missing_section
from .missing import missing_section_element
from ..constants import (
    DOCUMENT,
    EMBED_BEGIN,
    FIELD,
    FLAG,
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
            if required or required is None and self._all_elements_required:
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
            self._instantiated_elements_map = {}
            
            def instantiate_and_index(element):
                if element['type'] == EMBED_BEGIN:
                    instance = embed.Embed(self._context, element, self)
                elif element['type'] == FIELD:
                    instance = field.Field(self._context, element, self)
                elif element['type'] == FLAG:
                    instance = flag.Flag(self._context, element, self)
                elif element['type'] == SECTION:
                    instance = Section(self._context, element, self)

                if element['key'] in self._instantiated_elements_map:
                    self._instantiated_elements_map[element['key']].append(instance)
                else:
                    self._instantiated_elements_map[element['key']] = [instance]

                return instance

            self._instantiated_elements = [instantiate_and_index(element) for element in self._instruction['elements']]

        return self._instantiated_elements_map if as_map else self._instantiated_elements

    def _embed(self, key, *, required=None):
        self._touched = True

        if not key:
            elements = self._elements()
        else:
            elements_map = self._elements(True)
            elements = elements_map[key] if key in elements_map else []

        if len(elements) == 0:
            if required or required is None and self._all_elements_required:
                raise Validation.missing_element(self._context, key, self._instruction, 'missing_embed')
            elif required is None:
                return missing_embed.MissingEmbed(key, self)
            else:
                return None

        if len(elements) > 1:
            raise Validation.unexpected_multiple_elements(
                self._context,
                key,
                [element._instruction for element in elements],
                'expected_single_embed'
            )

        element = elements[0]

        if element._instruction['type'] != EMBED_BEGIN:
            raise Validation.unexpected_element_type(self._context, key, element._instruction, 'expected_embed')

        return element

    def _flag(self, key, *, required=None):
        self._touched = True

        if not key:
            elements = self._elements()
        else:
            elements_map = self._elements(True)
            elements = elements_map[key] if key in elements_map else []

        if len(elements) == 0:
            if required or required is None and self._all_elements_required:
                raise Validation.missing_element(self._context, key, self._instruction, 'missing_flag')
            elif required is None:
                return missing_flag.MissingFlag(key, self)
            else:
                return None

        if len(elements) > 1:
            raise Validation.unexpected_multiple_elements(
                self._context,
                key,
                [element._instruction for element in elements],
                'expected_single_flag'
            )

        element = elements[0]

        if element._instruction['type'] != FLAG:
            raise Validation.unexpected_element_type(self._context, key, element._instruction, 'expected_flag')

        return element

    def _field(self, key, *, required=None):
        self._touched = True

        if not key:
            elements = self._elements()
        else:
            elements_map = self._elements(True)
            elements = elements_map[key] if key in elements_map else []

        if len(elements) == 0:
            if required or required is None and self._all_elements_required:
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

        if element._instruction['type'] != FIELD:
            raise Validation.unexpected_element_type(self._context, key, element._instruction, 'expected_field')

        return element

    def _missing_error(self, element):
        if isinstance(element, missing_field.MissingField):
            raise Validation.missing_element(self._context, element._key, self._instruction, 'missing_field')
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
            if required or required is None and self._all_elements_required:
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

        return element

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
            if element._instruction['type'] == SECTION:
                element.all_elements_required(required)
            elif element._instruction['type'] == FIELD:
                element.all_attributes_required(required)

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

    def embed(self, key=None):
        return self._embed(key)

    def embeds(self, key=None):
        self._touched = True

        if not key:
            elements = self._elements()
        else:
            elements_map = self._elements(True)
            elements = elements_map[key] if key in elements_map else []

        def typecheck(element):
            if element._instruction['type'] != EMBED_BEGIN:
                raise Validation.unexpected_element_type(self._context, key, element._instruction, 'expected_embeds')

            return element

        return [typecheck(element) for element in elements]
        
    def field(self, key=None):
        return self._field(key)

    def fields(self, key=None):
        self._touched = True

        if not key:
            elements = self._elements()
        else:
            elements_map = self._elements(True)
            elements = elements_map[key] if key in elements_map else []

        def typecheck(element):
            if element._instruction['type'] != FIELD:
                raise Validation.unexpected_element_type(self._context, key, element._instruction, 'expected_fields')

            return element

        return [typecheck(element) for element in elements]

    def flag(self, key=None):
        return self._flag(key)

    def flags(self, key=None):
        self._touched = True

        if not key:
            elements = self._elements()
        else:
            elements_map = self._elements(True)
            elements = elements_map[key] if key in elements_map else []

        def typecheck(element):
            if element._instruction['type'] != FLAG:
                raise Validation.unexpected_element_type(self._context, key, element._instruction, 'expected_flags')

            return element

        return [typecheck(element) for element in elements]

    def optional_element(self, key):
        return self._element(key, required=False)

    def optional_embed(self, key):
        return self._embed(key, required=False)

    def optional_field(self, key):
        return self._field(key, required=False)

    def optional_flag(self, key):
        return self._flag(key, required=False)

    def optional_section(self, key):
        return self._section(key, required=False)

    def parent(self):
        if self._instruction['type'] == DOCUMENT:
            return None

        return self._parent or Section(self._context, self._instruction['parent'])

    def required_element(self, key=None):
        return self._element(key, required=True)

    def required_embed(self, key=None):
        return self._embed(key, required=True)

    def required_field(self, key=None):
        return self._field(key, required=True)

    def required_flag(self, key=None):
        return self._flag(key, required=True)

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

        def typecheck(element):
            if element._instruction['type'] != SECTION:
                raise Validation.unexpected_element_type(self._context, key, element._instruction, 'expected_sections')

            return element

        return [typecheck(element) for element in elements]

    def touch(self):
        self._touched = True

        for element in self._elements():
            element.touch()
