# frozen_string_literal: true

#  GENERATED ON 2022-03-29T14:08:57 - DO NOT EDIT MANUALLY

module Enolib
  module Locales
    module De
      CONTENT_HEADER = 'Inhalt'
      EXPECTED_DOCUMENT = 'Das Dokument wurde erwartet.'
      EXPECTED_EMPTY = 'Ein Leerfeld wurde erwartet.'
      EXPECTED_FIELD = 'Ein Feld wurde erwartet.'
      EXPECTED_FIELDS = 'Nur Felder wurden erwartet.'
      EXPECTED_FIELDSET = 'Ein Fieldset wurde erwartet.'
      EXPECTED_FIELDSET_ENTRY = 'Ein Fieldset Eintrag wurde erwartet.'
      EXPECTED_FIELDSETS = 'Nur Fieldsets wurden erwartet.'
      EXPECTED_LIST = 'Eine Liste wurde erwartet.'
      EXPECTED_LIST_ITEM = 'Ein Listen Eintrag wurde erwartet.'
      EXPECTED_LISTS = 'Nur Listen wurden erwartet.'
      EXPECTED_SECTION = 'Eine Sektion wurde erwartet.'
      EXPECTED_SECTIONS = 'Nur Sektionen wurden erwartet.'
      EXPECTED_SINGLE_ELEMENT = 'Nur ein einzelnes Element wurde erwartet.'
      EXPECTED_SINGLE_EMPTY = 'Nur ein einzelnes Leerfeld wurde erwartet.'
      EXPECTED_SINGLE_FIELD = 'Nur ein einzelnes Feld wurde erwartet.'
      EXPECTED_SINGLE_FIELDSET = 'Nur ein einzelnes Fieldset wurde erwartet.'
      EXPECTED_SINGLE_FIELDSET_ENTRY = 'Nur ein einzelner Fieldset Eintrag wurde erwartet.'
      EXPECTED_SINGLE_LIST = 'Nur eine einzelne Liste wurde erwartet.'
      EXPECTED_SINGLE_SECTION = 'Nur eine einzelne Sektion wurde erwartet.'
      GUTTER_HEADER = 'Zeile'
      MISSING_COMMENT = 'Ein erforderlicher Kommentar zu diesem Feld fehlt.'
      MISSING_ELEMENT = 'Ein einzelnes Element ist erforderlich - es kann einen beliebigen Schlüssel haben.'
      MISSING_EMPTY = 'Ein einzelnes Leerfeld ist erforderlich - es kann einen beliebigen Schlüssel haben.'
      MISSING_FIELD = 'Ein einzelnes Feld ist erforderlich - es kann einen beliebigen Schlüssel haben.'
      MISSING_FIELDSET = 'Ein einzelnes Fieldset ist erforderlich - es kann einen beliebigen Schlüssel haben.'
      MISSING_FIELDSET_ENTRY = 'Ein einzelner Fieldset Eintrag ist erforderlich - er kann einen beliebigen Schlüssel haben.'
      MISSING_LIST = 'Eine einzelne Liste ist erforderlich - sie kann einen beliebigen Schlüssel haben.'
      MISSING_SECTION = 'Eine einzelne Sektion ist erforderlich - sie kann einen beliebigen Schlüssel haben.'
      UNEXPECTED_ELEMENT = 'Dieses Element wurde nicht erwartet, prüfe ob es am richtigen Platz ist und dass der Schlüssel keine Tippfehler enthält.'
      def self.comment_error(message) "Es gibt ein Problem mit dem Kommentar dieses Elements: #{message}" end
      def self.expected_empty_with_key(key) "Ein Leerfeld mit dem Schlüssel '#{key}' wurde erwartet." end
      def self.expected_field_with_key(key) "Ein Feld mit dem Schlüssel '#{key}' wurde erwartet." end
      def self.expected_fields_with_key(key) "Nur Felder mit dem Schlüssel '#{key}' wurden erwartet." end
      def self.expected_fieldset_with_key(key) "Ein Fieldset mit dem Schlüssel '#{key}' wurde erwartet." end
      def self.expected_fieldsets_with_key(key) "Nur Fieldsets mit dem Schlüssel '#{key}' wurden erwartet." end
      def self.expected_list_with_key(key) "Eine Liste mit dem Schlüssel '#{key}' wurde erwartet." end
      def self.expected_lists_with_key(key) "Nur Listen mit dem Schlüssel '#{key}' wurden erwartet." end
      def self.expected_section_with_key(key) "Eine Sektion mit dem Schlüssel '#{key}' wurde erwartet." end
      def self.expected_sections_with_key(key) "Nur Sektionen mit dem Schlüssel '#{key}' wurden erwartet." end
      def self.expected_single_element_with_key(key) "Nur ein einzelnes Element mit dem Schlüssel '#{key}' wurde erwartet." end
      def self.expected_single_empty_with_key(key) "Nur ein einzelnes Leerfeld mit dem Schlüssel '#{key}' wurde erwartet." end
      def self.expected_single_field_with_key(key) "Nur ein einzelnes Feld mit dem Schlüssel '#{key}' wurde erwartet." end
      def self.expected_single_fieldset_entry_with_key(key) "Nur ein einzelner Fieldset Eintrag mit dem Schlüssel '#{key}' wurde erwartet." end
      def self.expected_single_fieldset_with_key(key) "Nur ein einzelnes Fieldset mit dem Schlüssel '#{key}' wurde erwartet." end
      def self.expected_single_list_with_key(key) "Nur eine einzelne Liste mit dem Schlüssel '#{key}' wurde erwartet." end
      def self.expected_single_section_with_key(key) "Nur eine einzelne Sektion mit dem Schlüssel '#{key}' wurde erwartet." end
      def self.invalid_line(line) "Zeile #{line} folgt keinem spezifierten Muster." end
      def self.key_error(message) "Es gibt ein Problem mit dem Schlüssel dieses Elements: #{message}" end
      def self.missing_element_for_continuation(line) "Zeile #{line} enthält eine Zeilenfortsetzung ohne dass davor ein fortsetzbares Element begonnen wurde." end
      def self.missing_element_with_key(key) "Das Element '#{key}' fehlt - falls es angegeben wurde eventuell nach Tippfehlern Ausschau halten und auch die Gross/Kleinschreibung beachten." end
      def self.missing_empty_with_key(key) "Das Leerfeld '#{key}' fehlt - falls es angegeben wurde eventuell nach Tippfehlern Ausschau halten und auch die Gross/Kleinschreibung beachten." end
      def self.missing_field_value(key) "Das Feld '#{key}' muss einen Wert enthalten." end
      def self.missing_field_with_key(key) "Das Feld '#{key}' fehlt - falls es angegeben wurde eventuell nach Tippfehlern Ausschau halten und auch die Gross/Kleinschreibung beachten." end
      def self.missing_fieldset_entry_value(key) "Der Fieldset Eintrag '#{key}' muss einen Wert enthalten." end
      def self.missing_fieldset_entry_with_key(key) "Der Fieldset Eintrag '#{key}' fehlt - falls er angegeben wurde eventuell nach Tippfehlern Ausschau halten und auch die Gross/Kleinschreibung beachten." end
      def self.missing_fieldset_for_fieldset_entry(line) "Zeile #{line} enthält einen Fieldset Eintrag ohne dass davor ein Fieldset begonnen wurde." end
      def self.missing_fieldset_with_key(key) "Das Fieldset '#{key}' fehlt - falls es angegeben wurde eventuell nach Tippfehlern Ausschau halten und auch die Gross/Kleinschreibung beachten." end
      def self.missing_list_for_list_item(line) "Zeile #{line} enthält einen Listeneintrag ohne dass davor ein eine Liste begonnen wurde." end
      def self.missing_list_item_value(key) "Die Liste '#{key}' darf keine leeren Einträge enthalten." end
      def self.missing_list_with_key(key) "Die Liste '#{key}' fehlt - falls sie angegeben wurde eventuell nach Tippfehlern Ausschau halten und auch die Gross/Kleinschreibung beachten." end
      def self.missing_section_with_key(key) "Die Sektion '#{key}' fehlt - falls sie angegeben wurde eventuell nach Tippfehlern Ausschau halten und auch die Gross/Kleinschreibung beachten." end
      def self.section_hierarchy_layer_skip(line) "Zeile #{line} beginnt eine Sektion die mehr als eine Ebene tiefer liegt als die aktuelle." end
      def self.unterminated_escaped_key(line) "In Zeile #{line} wird der Schlüssel eines Elements escaped, jedoch wird diese Escape Sequenz bis zum Ende der Zeile nicht mehr beendet." end
      def self.unterminated_multiline_field(key, line) "Das Mehrzeilenfeld '#{key}' dass in Zeile #{line} beginnt wird bis zum Ende des Dokuments nicht mehr beendet." end
      def self.value_error(message) "Es gibt ein Problem mit dem Wert dieses Elements: #{message}" end
    end
  end
end