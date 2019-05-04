from .errors.parsing import Parsing
from .constants import (
    EMPTY_ELEMENT,
    FIELD,
    FIELDSET,
    LIST,
    MULTILINE_FIELD_BEGIN,
    SECTION
)

class Resolver:
    def __init__(self, context):
        self._context = context

        self._unresolved_sections = hasattr(self._context, '_copy_sections')
        self._unresolved_non_section_elements = hasattr(self._context, '_copy_non_section_elements')

    def consolidate_non_section_elements(self, element, template):
        # TODO: Do this lazily as todo'd elsewhere
        if 'comments' in template and not 'comments' in element:
            element['comments'] = template['comments']

        if element['type'] == EMPTY_ELEMENT:
            if template['type'] == MULTILINE_FIELD_BEGIN:
                element['type'] = FIELD  # TODO: Revisit this - maybe should be MULTILINE_FIELD_COPY or something else - consider implications all around.
                self.mirror(element, template)
            elif template['type'] == FIELD:
                element['type'] = FIELD
                self.mirror(element, template)
            elif template['type'] == FIELDSET:
                element['type'] = FIELDSET
                self.mirror(element, template)
            elif template['type'] == LIST:
                element['type'] = LIST
                self.mirror(element, template)
        elif element['type'] == FIELDSET:
            if template['type'] == FIELDSET:
                element['extend'] = template
            elif (template['type'] == FIELD or
                  template['type'] == LIST or
                  template['type'] == MULTILINE_FIELD_BEGIN):
                raise Parsing.missing_fieldset_for_fieldset_entry(self._context, element['entries'][0])
        elif element['type'] == LIST:
            if template['type'] == LIST:
                element['extend'] = template
            elif (template['type'] == FIELD or
                  template['type'] == FIELDSET or
                  template['type'] == MULTILINE_FIELD_BEGIN):
                raise Parsing.missing_list_for_list_item(self._context, element['items'][0])

    def consolidate_sections(self, section, template, deep_merge):
        if 'comments' in template and not 'comments' in section:
            section['comments'] = template['comments']

        if len(section['elements']) == 0:
            self.mirror(section, template)
        else:
            # TODO: Handle possibility in two templates (one hardcoded in the document, one implicitly derived through deep merging)
            #       Possibly also elswhere (e.g. up there in the mirror branch?)
            section['extend'] = template

            if not deep_merge:
                return

            merge_map = {}

            for section_element in section['elements']:
                if section_element['type'] != SECTION or section_element['key'] in merge_map:
                    merge_map[section_element['key']] = False # non-mergable (no section or multiple sections with same key)
                else:
                    merge_map[section_element['key']] = { 'section': section_element }

            for section_element in template['elements']:
                if section_element['key'] in merge_map:
                    merger = merge_map[section_element['key']]

                    if merger is False:
                        continue

                    if section_element['type'] != SECTION or 'template' in merger:
                        merge_map[section_element['key']] = False # non-mergable (no section or multiple template sections with same key)
                    else:
                        merger['template'] = section_element

            for merger in merge_map.values():
                if merger and 'template' in merger:
                    self.consolidate_sections(merger['section'], merger['template'], True)

    def mirror(self, element, template):
        if 'mirror' in template:
            element['mirror'] = template['mirror']
        else:
            element['mirror'] = template

    def resolve_non_section_element(self, element, previous_elements):
        if element in previous_elements:
            raise Parsing.cyclic_dependency(self._context, element, previous_elements)

        template = element['copy']['template']

        if 'copy' in template: # TODO: Maybe we change that to .unresolved everywhere ?
            self.resolve_non_section_element(template, [*previous_elements, element])

        self.consolidate_non_section_elements(element, template)

        del element['copy']

    def resolve_section(self, section, previous_sections):
        if section in previous_sections:
            raise Parsing.cyclic_dependency(self._context, section, previous_sections)

        if 'deep_resolve' in section:
            for section_element in section['elements']:
                if section_element['type'] == SECTION and ('copy' in section_element or 'deep_resolve' in section_element):
                    self.resolve_section(section_element, [*previous_sections, section])

            del section['deep_resolve']

        if 'copy' in section:
            template = section['copy']['template']

            if 'copy'in template or 'deep_resolve' in template:
                self.resolve_section(template, [*previous_sections, section])

            self.consolidate_sections(section, template, 'deep_copy' in section)

            del section['copy']

    def index(self, section):
        for element in section['elements']:
            if element['type'] == SECTION:
                self.index(element)

                if (self._unresolved_sections and
                    element['key'] in self._context._copy_sections and
                    ('template' not in element or element['key'] != element['template'])):
                    copy_data = self._context._copy_sections[element['key']]

                    if 'template' in copy_data:
                        raise Parsing.two_or_more_templates_found(self._context, copy_data['targets'][0], copy_data['template'], element)

                    copy_data['template'] = element
            elif (self._unresolved_non_section_elements and
                  element['key'] in self._context._copy_non_section_elements and
                  ('template' not in element or element['key'] != element['template'])):
                copy_data = self._context._copy_non_section_elements[element['key']]

                if 'template' in copy_data:
                    raise Parsing.two_or_more_templates_found(self._context, copy_data['targets'][0], copy_data['template'], element)

                copy_data['template'] = element

    def resolve(self):
        self.index(self._context.document)

        if self._unresolved_non_section_elements:
            for copy in self._context._copy_non_section_elements.values():
                if not 'template' in copy:
                    raise Parsing.non_section_element_not_found(self._context, copy['targets'][0])

                for target in copy['targets']:
                    if 'copy' in target:
                        self.resolve_non_section_element(target, [])

            del self._context._copy_non_section_elements

        if self._unresolved_sections:
            for copy in self._context._copy_sections.values():
                if not 'template' in copy:
                    raise Parsing.section_not_found(self._context, copy['targets'][0])

                for target in copy['targets']:
                    if 'copy' in target:
                        self.resolve_section(target, [])

            del self._context._copy_sections
