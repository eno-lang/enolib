# frozen_string_literal: true

module Enolib
  HUMAN_INDEXING = 1
  PRETTY_TYPES = {
    document: 'document',
    empty: 'empty',
    field: 'field',
    fieldset: 'fieldset',
    fieldset_entry: 'fieldset_entry',
    field_or_fieldset_or_list: 'field_or_fieldset_or_list',
    list: 'list',
    list_item: 'list_item',
    multiline_field_begin: 'field',
    section: 'section'
  }.freeze
end
