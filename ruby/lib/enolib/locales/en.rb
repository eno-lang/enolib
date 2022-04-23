# frozen_string_literal: true

#  GENERATED ON 2022-04-16T08:31:09 - DO NOT EDIT MANUALLY

module Enolib
  module Locales
    module En
      CONTENT_HEADER = 'Content'
      EXPECTED_ATTRIBUTE = 'An attribute was expected.'
      EXPECTED_ATTRIBUTES = 'This field was expected to contain only attributes.'
      EXPECTED_DOCUMENT = 'The document was expected.'
      EXPECTED_EMBED = 'An embed was expected.'
      EXPECTED_EMBEDS = 'Only embeds were expected.'
      EXPECTED_FIELD = 'A field was expected.'
      EXPECTED_FIELDS = 'Only fields were expected.'
      EXPECTED_FLAG = 'A flag was expected.'
      EXPECTED_FLAGS = 'Only flags were expected.'
      EXPECTED_ITEMS = 'This field was expected to contain only items.'
      EXPECTED_SECTION = 'A section was expected.'
      EXPECTED_SECTIONS = 'Only sections were expected.'
      EXPECTED_SINGLE_ATTRIBUTE = 'This field was expected to contain only a single attribute.'
      EXPECTED_SINGLE_ELEMENT = 'Only a single element was expected.'
      EXPECTED_SINGLE_EMBED = 'Only a single embed was expected.'
      EXPECTED_SINGLE_FIELD = 'Only a single field was expected.'
      EXPECTED_SINGLE_FLAG = 'Only a single flag was expected.'
      EXPECTED_SINGLE_ITEM = 'This field was expected to contain only a single item.'
      EXPECTED_SINGLE_SECTION = 'Only a single section was expected.'
      EXPECTED_VALUE = 'This field was expected to contain only a value.'
      GUTTER_HEADER = 'Line'
      MISSING_ATTRIBUTE = 'A single attribute is required - it can have any key.'
      MISSING_COMMENT = 'A required comment for this element is missing.'
      MISSING_ELEMENT = 'A single element is required - it can have any key.'
      MISSING_EMBED = 'A single embed is required - it can have any key.'
      MISSING_FIELD = 'A single field is required - it can have any key.'
      MISSING_FLAG = 'A single flag is required - it can have any key.'
      MISSING_SECTION = 'A single section is required - it can have any key.'
      UNEXPECTED_ELEMENT = 'This element was not expected, make sure it is at the right place in the document and that its key is not mis-typed.'
      def self.attribute_outside_field(line) "The attribute in line #{line} is not contained within a field." end
      def self.attribute_without_key(line) "The attribute in line #{line} has no key." end
      def self.comment_error(message) "There is a problem with the comment of this element: #{message}" end
      def self.continuation_outside_field(line) "The continuation in line #{line} is not contained within a field." end
      def self.embed_without_key(line) "The embed in line #{line} has no key." end
      def self.escape_without_key(line) "The escape sequence in line #{line} specifies no key." end
      def self.expected_attribute_with_key(key) "An attribute with the key '#{key}' was expected." end
      def self.expected_attributes_with_key(key) "This field was expected to contain only attributes with the key '#{key}'." end
      def self.expected_embed_with_key(key) "An embed with the key '#{key}' was expected." end
      def self.expected_embeds_with_key(key) "Only embeds with the key '#{key}' were expected." end
      def self.expected_field_with_key(key) "A field with the key '#{key}' was expected." end
      def self.expected_fields_with_key(key) "Only fields with the key '#{key}' were expected." end
      def self.expected_flag_with_key(key) "A flag with the key '#{key}' was expected." end
      def self.expected_flags_with_key(key) "Only flags with the key '#{key}' were expected." end
      def self.expected_section_with_key(key) "A section with the key '#{key}' was expected." end
      def self.expected_sections_with_key(key) "Only sections with the key '#{key}' were expected." end
      def self.expected_single_attribute_with_key(key) "This field was expected to contain only a single attribute with the key '#{key}'." end
      def self.expected_single_element_with_key(key) "Only a single element with the key '#{key}' was expected." end
      def self.expected_single_embed_with_key(key) "Only a single embed with the key '#{key}' was expected." end
      def self.expected_single_field_with_key(key) "Only a single field with the key '#{key}' was expected." end
      def self.expected_single_flag_with_key(key) "Only a single flag with the key '#{key}' was expected." end
      def self.expected_single_section_with_key(key) "Only a single section with the key '#{key}' was expected." end
      def self.field_without_key(line) "The field in line #{line} has no key." end
      def self.invalid_after_escape(line) "The escape sequence in line #{line} can only be followed by an attribute or field operator." end
      def self.item_outside_field(line) "The item in line #{line} is not contained within a field." end
      def self.key_error(message) "There is a problem with the key of this element: #{message}" end
      def self.missing_attribute_value(key) "The attribute '#{key}' must contain a value." end
      def self.missing_attribute_with_key(key) "The attribute '#{key}' is missing - in case it has been specified look for typos and also check for correct capitalization." end
      def self.missing_element_with_key(key) "The element '#{key}' is missing - in case it has been specified look for typos and also check for correct capitalization." end
      def self.missing_embed_with_key(key) "The embed '#{key}' is missing - in case it has been specified look for typos and also check for correct capitalization." end
      def self.missing_field_value(key) "The field '#{key}' must contain a value." end
      def self.missing_field_with_key(key) "The field '#{key}' is missing - in case it has been specified look for typos and also check for correct capitalization." end
      def self.missing_flag_with_key(key) "The flag '#{key}' is missing - in case it has been specified look for typos and also check for correct capitalization." end
      def self.missing_item_value(key) "The field '#{key}' may not contain empty items." end
      def self.missing_section_with_key(key) "The section '#{key}' is missing - in case it has been specified look for typos and also check for correct capitalization." end
      def self.mixed_field_content(line) "The field in line #{line} must contain either only attributes, only items, or only a value." end
      def self.section_level_skip(line) "The section in line #{line} is more than one level deeper than the one it is contained in." end
      def self.section_without_key(line) "The section in line #{line} has no key." end
      def self.unterminated_embed(key, line) "The embed '#{key}' starting in line #{line} is not terminated until the end of the document." end
      def self.unterminated_escaped_key(line) "The key escape sequence in line #{line} is not terminated before the end of the line." end
      def self.value_error(message) "There is a problem with the value of this element: #{message}" end
    end
  end
end