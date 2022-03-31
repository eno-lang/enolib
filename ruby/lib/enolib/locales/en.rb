# frozen_string_literal: true

#  GENERATED ON 2022-03-29T14:08:57 - DO NOT EDIT MANUALLY

module Enolib
  module Locales
    module En
      CONTENT_HEADER = 'Content'
      EXPECTED_DOCUMENT = 'The document was expected.'
      EXPECTED_EMPTY = 'An empty was expected.'
      EXPECTED_FIELD = 'A field was expected.'
      EXPECTED_FIELDS = 'Only fields were expected.'
      EXPECTED_FIELDSET = 'A fieldset was expected.'
      EXPECTED_FIELDSET_ENTRY = 'A fieldset entry was expected.'
      EXPECTED_FIELDSETS = 'Only fieldsets were expected.'
      EXPECTED_LIST = 'A list was expected.'
      EXPECTED_LIST_ITEM = 'A list item was expected.'
      EXPECTED_LISTS = 'Only lists were expected.'
      EXPECTED_SECTION = 'A section was expected.'
      EXPECTED_SECTIONS = 'Only sections were expected.'
      EXPECTED_SINGLE_ELEMENT = 'Only a single element was expected.'
      EXPECTED_SINGLE_EMPTY = 'Only a single empty was expected.'
      EXPECTED_SINGLE_FIELD = 'Only a single field was expected.'
      EXPECTED_SINGLE_FIELDSET = 'Only a single fieldset was expected.'
      EXPECTED_SINGLE_FIELDSET_ENTRY = 'Only a single fieldset entry was expected.'
      EXPECTED_SINGLE_LIST = 'Only a single list was expected.'
      EXPECTED_SINGLE_SECTION = 'Only a single section was expected.'
      GUTTER_HEADER = 'Line'
      MISSING_COMMENT = 'A required comment for this element is missing.'
      MISSING_ELEMENT = 'A single element is required - it can have any key.'
      MISSING_EMPTY = 'A single empty is required - it can have any key.'
      MISSING_FIELD = 'A single field is required - it can have any key.'
      MISSING_FIELDSET = 'A single fieldset is required - it can have any key.'
      MISSING_FIELDSET_ENTRY = 'A single fieldset entry is required - it can have any key.'
      MISSING_LIST = 'A single list is required - it can have any key.'
      MISSING_SECTION = 'A single section is required - it can have any key.'
      UNEXPECTED_ELEMENT = 'This element was not expected, make sure it is at the right place in the document and that its key is not mis-typed.'
      def self.comment_error(message) "There is a problem with the comment of this element: #{message}" end
      def self.expected_empty_with_key(key) "An empty with the key '#{key}' was expected." end
      def self.expected_field_with_key(key) "A field with the key '#{key}' was expected." end
      def self.expected_fields_with_key(key) "Only fields with the key '#{key}' were expected." end
      def self.expected_fieldset_with_key(key) "A fieldset with the key '#{key}' was expected." end
      def self.expected_fieldsets_with_key(key) "Only fieldsets with the key '#{key}' were expected." end
      def self.expected_list_with_key(key) "A list with the key '#{key}' was expected." end
      def self.expected_lists_with_key(key) "Only lists with the key '#{key}' were expected." end
      def self.expected_section_with_key(key) "A section with the key '#{key}' was expected." end
      def self.expected_sections_with_key(key) "Only sections with the key '#{key}' were expected." end
      def self.expected_single_element_with_key(key) "Only a single element with the key '#{key}' was expected." end
      def self.expected_single_empty_with_key(key) "Only a single empty with the key '#{key}' was expected." end
      def self.expected_single_field_with_key(key) "Only a single field with the key '#{key}' was expected." end
      def self.expected_single_fieldset_entry_with_key(key) "Only a single fieldset entry with the key '#{key}' was expected." end
      def self.expected_single_fieldset_with_key(key) "Only a single fieldset with the key '#{key}' was expected." end
      def self.expected_single_list_with_key(key) "Only a single list with the key '#{key}' was expected." end
      def self.expected_single_section_with_key(key) "Only a single section with the key '#{key}' was expected." end
      def self.invalid_line(line) "Line #{line} does not follow any specified pattern." end
      def self.key_error(message) "There is a problem with the key of this element: #{message}" end
      def self.missing_element_for_continuation(line) "Line #{line} contains a line continuation without a continuable element being specified before." end
      def self.missing_element_with_key(key) "The element '#{key}' is missing - in case it has been specified look for typos and also check for correct capitalization." end
      def self.missing_empty_with_key(key) "The empty '#{key}' is missing - in case it has been specified look for typos and also check for correct capitalization." end
      def self.missing_field_value(key) "The field '#{key}' must contain a value." end
      def self.missing_field_with_key(key) "The field '#{key}' is missing - in case it has been specified look for typos and also check for correct capitalization." end
      def self.missing_fieldset_entry_value(key) "The fieldset entry '#{key}' must contain a value." end
      def self.missing_fieldset_entry_with_key(key) "The fieldset entry '#{key}' is missing - in case it has been specified look for typos and also check for correct capitalization." end
      def self.missing_fieldset_for_fieldset_entry(line) "Line #{line} contains a fieldset entry without a fieldset being specified before." end
      def self.missing_fieldset_with_key(key) "The fieldset '#{key}' is missing - in case it has been specified look for typos and also check for correct capitalization." end
      def self.missing_list_for_list_item(line) "Line #{line} contains a list item without a list being specified before." end
      def self.missing_list_item_value(key) "The list '#{key}' may not contain empty items." end
      def self.missing_list_with_key(key) "The list '#{key}' is missing - in case it has been specified look for typos and also check for correct capitalization." end
      def self.missing_section_with_key(key) "The section '#{key}' is missing - in case it has been specified look for typos and also check for correct capitalization." end
      def self.section_hierarchy_layer_skip(line) "Line #{line} starts a section that is more than one level deeper than the current one." end
      def self.unterminated_escaped_key(line) "In line #{line} the key of an element is escaped, but the escape sequence is not terminated until the end of the line." end
      def self.unterminated_multiline_field(key, line) "The multiline field '#{key}' starting in line #{line} is not terminated until the end of the document." end
      def self.value_error(message) "There is a problem with the value of this element: #{message}" end
    end
  end
end