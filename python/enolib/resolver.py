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

  def consolidate_non_section_elements(self, instruction, template):
    if 'comments' in template and not 'comments' in instruction:
      instruction['comments'] = template['comments']

    if instruction['type'] == EMPTY_ELEMENT:
      if template['type'] == MULTILINE_FIELD_BEGIN:
        instruction['type'] = FIELD  # TODO: Revisit this - maybe should be MULTILINE_FIELD_COPY or something else - consider implications all around.
        self.mirror(instruction, template)
      elif template['type'] == FIELD:
        instruction['type'] = FIELD
        self.mirror(instruction, template)
      elif template['type'] == FIELDSET:
        instruction['type'] = FIELDSET
        self.mirror(instruction, template)
      elif template['type'] == LIST:
        instruction['type'] = LIST
        self.mirror(instruction, template)
    elif instruction['type'] == FIELDSET:
      if template['type'] == FIELDSET:
        instruction['extend'] = template
      elif (template['type'] == FIELD or
            template['type'] == LIST or
            template['type'] == MULTILINE_FIELD_BEGIN):
        raise Parsing.missing_fieldset_for_fieldset_entry(self._context, instruction['entries'][0])
    elif instruction['type'] == LIST:
      if template['type'] == LIST:
        instruction['extend'] = template
      elif (template['type'] == FIELD or
            template['type'] == FIELDSET or
            template['type'] == MULTILINE_FIELD_BEGIN):
        raise Parsing.missing_list_for_list_item(self._context, instruction['items'][0])

  def consolidate_sections(self, instruction, template, deep_merge):
    if 'comments' in template and not 'comments' in instruction:
      instruction['comments'] = template['comments']

    if len(instruction['elements']) == 0:
      self.mirror(instruction, template)
    else:
      # TODO: Handle possibility in two templates (one hardcoded in the document, one implicitly derived through deep merging)
      #       Possibly also elswhere (e.g. up there in the mirror branch?)
      instruction['extend'] = template

      if not deep_merge:
        return

      merge_map = {}

      for section_element in instruction['elements']:
        if section_element['type'] != SECTION or section_element['key'] in merge_map:
          merge_map[section_element['key']] = False # non-mergable (no section or multiple instructions with same key)
        else:
          merge_map[section_element['key']] = { 'instruction': section_element }

      for section_element in template['elements']:
        if section_element['key'] in merge_map:
          merger = merge_map[section_element['key']]

          if merger is False:
            continue

          if section_element['type'] != SECTION or 'template' in merger:
            merge_map[section_element['key']] = False # non-mergable (no section or multiple template instructions with same key)
          else:
            merger['template'] = section_element

      for merger in merge_map.values():
        if merger and 'template' in merger:
          self.consolidate_sections(merger['instruction'], merger['template'], True)

  def mirror(self, instruction, template):
    if 'mirror' in template:
      instruction['mirror'] = template['mirror']
    else:
      instruction['mirror'] = template

  def resolve_non_section_element(self, instruction, previous_instructions=[]):
    if instruction in previous_instructions:
      raise Parsing.cyclic_dependency(self._context, instruction, previous_instructions)

    template = instruction['copy']['template']

    if 'copy' in template: # TODO: Maybe we change that to .unresolved everywhere ?
      self.resolve_non_section_element(template, [*previous_instructions, instruction])

    self.consolidate_non_section_elements(instruction, template)

    del instruction['copy']

  def resolve_section(self, instruction, previous_instructions=[]):
    if instruction in previous_instructions:
      raise Parsing.cyclic_dependency(self._context, instruction, previous_instructions)

    if 'deep_resolve' in instruction:
      for element_instruction in instruction['elements']:
        if element_instruction['type'] == SECTION and ('copy' in element_instruction or 'deep_resolve' in element_instruction):
          self.resolve_section(element_instruction, [*previous_instructions, instruction])

      del instruction['deep_resolve']

    if 'copy' in instruction:
      template = instruction['copy']['template']

      if 'copy'in template or 'deep_resolve' in template:
        self.resolve_section(template, [*previous_instructions, instruction])

      self.consolidate_sections(instruction, template, 'deep_copy' in instruction)

      del instruction['copy']

  def index(self, section):
    for element_instruction in section['elements']:
      if element_instruction['type'] == SECTION:
        self.index(element_instruction)

        if (self._unresolved_sections and
            element_instruction['key'] in self._context._copy_sections and
            ('template' not in element_instruction or
             element_instruction['key'] != element_instruction['template'])):
          copy_data = self._context._copy_sections[element_instruction['key']]

          if 'template' in copy_data:
            raise Parsing.two_or_more_templates_found(self._context, copy_data['targets'][0], copy_data['template'], element_instruction)

          copy_data['template'] = element_instruction
      elif (self._unresolved_non_section_elements and
            element_instruction['key'] in self._context._copy_non_section_elements and
            ('template' not in element_instruction or
             element_instruction['key'] != element_instruction['template'])):
        copy_data = self._context._copy_non_section_elements[element_instruction['key']]

        if 'template' in copy_data:
          raise Parsing.two_or_more_templates_found(self._context, copy_data['targets'][0], copy_data['template'], element_instruction)

        copy_data['template'] = element_instruction

  def resolve(self):
    self.index(self._context.document)

    if self._unresolved_non_section_elements:
      for copy in self._context._copy_non_section_elements.values():
        if not 'template' in copy:
          raise Parsing.non_section_element_not_found(self._context, copy['targets'][0])

        for target in copy['targets']:
          if not 'copy' in target:
            continue

          self.resolve_non_section_element(target)

      del self._context._copy_non_section_elements

    if self._unresolved_sections:
      for copy in self._context._copy_sections.values():
        if not 'template' in copy:
          raise Parsing.section_not_found(self._context, copy['targets'][0])

        for target in copy['targets']:
          if not 'copy' in target:
            continue

          self.resolve_section(target)

      del self._context._copy_sections
