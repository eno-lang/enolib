# frozen_string_literal: true

#  GENERATED ON 2019-06-18T08:50:41 - DO NOT EDIT MANUALLY

module Enolib
  module Locales
    module Es
      CONTENT_HEADER = 'Contenido'
      EXPECTED_DOCUMENT = 'Se esperaba el documento.'
      EXPECTED_EMPTY = 'Se esperaba un elemento vacío.'
      EXPECTED_FIELD = 'Se esperaba una casilla.'
      EXPECTED_FIELDS = 'Solo se esperaban casillas.'
      EXPECTED_FIELDSET = 'Se esperaba una collecíon de casillas.'
      EXPECTED_FIELDSET_ENTRY = 'Se esperaba una casilla de collecíon.'
      EXPECTED_FIELDSETS = 'Solo se esperaban colleciones de casillas.'
      EXPECTED_LIST = 'Se esperaba una lista.'
      EXPECTED_LIST_ITEM = 'Se esperaba una entrada de lista.'
      EXPECTED_LISTS = 'Solo se esperaban listas.'
      EXPECTED_SECTION = 'Se esperaba una sección.'
      EXPECTED_SECTIONS = 'Solo se esperaban secciones.'
      EXPECTED_SINGLE_ELEMENT = 'Solo se esperaba un único elemento.'
      EXPECTED_SINGLE_EMPTY = 'Solo se esperaba un único elemento vacío.'
      EXPECTED_SINGLE_FIELD = 'Solo se esperaba una sola casilla.'
      EXPECTED_SINGLE_FIELDSET = 'Solo se esperaba una sola collecíon de casillas.'
      EXPECTED_SINGLE_FIELDSET_ENTRY = 'Solo se esperaba una sola casilla de collecíon.'
      EXPECTED_SINGLE_LIST = 'Solo se esperaba una sola lista.'
      EXPECTED_SINGLE_SECTION = 'Solo se esperaba una sola sección.'
      GUTTER_HEADER = 'Línea'
      MISSING_COMMENT = 'Falta un comentario necesario para este elemento.'
      MISSING_ELEMENT = 'Se requiere un único elemento - puede tener cualquier clave.'
      MISSING_EMPTY = 'Se requiere un único elemento vacío - puede tener cualquier clave.'
      MISSING_FIELD = 'Se requiere una sola casilla - puede tener cualquier clave.'
      MISSING_FIELDSET = 'Se requiere una sola collecíon de casillas - puede tener cualquier clave.'
      MISSING_FIELDSET_ENTRY = 'Se requiere una sola casilla de collecíon - puede tener cualquier clave.'
      MISSING_LIST = 'Se requiere una sola lista - puede tener cualquier clave.'
      MISSING_SECTION = 'Se requiere una sola sección - puede tener cualquier clave.'
      UNEXPECTED_ELEMENT = 'Este elemento no se esperaba, averigua si es en el sitio correcto y que no contiene un error tipográfico la clave.'
      def self.comment_error(message) "Hay un problema con el comentario de este elemento: #{message}" end
      def self.cyclic_dependency(line, key) "En la línea #{line} '#{key}' se copia en sí mismo." end
      def self.expected_empty_with_key(key) "Se esperaba un elemento vacío con la clave '#{key}'." end
      def self.expected_field_with_key(key) "Se esperaba una casilla con la clave '#{key}'." end
      def self.expected_fields_with_key(key) "Solo se esperaban casillas con la clave '#{key}'." end
      def self.expected_fieldset_with_key(key) "Se esperaba una collecíon de casillas con la clave '#{key}'." end
      def self.expected_fieldsets_with_key(key) "Solo se esperaban colleciones de casillas con la clave '#{key}'." end
      def self.expected_list_with_key(key) "Se esperaba una lista con la clave '#{key}'." end
      def self.expected_lists_with_key(key) "Solo se esperaban listas con la clave '#{key}'." end
      def self.expected_section_with_key(key) "Se esperaba una sección con la clave '#{key}'." end
      def self.expected_sections_with_key(key) "Solo se esperaban secciones con la clave '#{key}'." end
      def self.expected_single_element_with_key(key) "Solo se esperaba un único elemento con la clave '#{key}'." end
      def self.expected_single_empty_with_key(key) "Solo se esperaba un único elemento vacío con la clave '#{key}'." end
      def self.expected_single_field_with_key(key) "Solo se esperaba una sola casilla con la clave '#{key}'." end
      def self.expected_single_fieldset_entry_with_key(key) "Solo se esperaba una sola casilla de collecíon con la clave '#{key}'." end
      def self.expected_single_fieldset_with_key(key) "Solo se esperaba una sola collecíon de casillas con la clave '#{key}'." end
      def self.expected_single_list_with_key(key) "Solo se esperaba una sola lista con la clave '#{key}'." end
      def self.expected_single_section_with_key(key) "Solo se esperaba una sola sección con la clave '#{key}'." end
      def self.invalid_line(line) "Línea #{line} no sigue un patrón especificado." end
      def self.key_error(message) "Hay un problema con la clave de este elemento: #{message}" end
      def self.missing_element_for_continuation(line) "Línea #{line} contiene una continuacíon de línea sin un elemento que se puede continuar empezado antes." end
      def self.missing_element_with_key(key) "Falta el elemento '#{key}' - si se proporcionó, mira por errores ortográficos y también distingue entre mayúsculas y minúsculas." end
      def self.missing_empty_with_key(key) "Falta el elemento vacío '#{key}' - si se proporcionó, mira por errores ortográficos y también distingue entre mayúsculas y minúsculas." end
      def self.missing_field_value(key) "La casilla '#{key}' debe contener un valor." end
      def self.missing_field_with_key(key) "Falta la casilla '#{key}' - si se proporcionó, mira por errores ortográficos y también distingue entre mayúsculas y minúsculas." end
      def self.missing_fieldset_entry_value(key) "La casilla de collecíon '#{key}' debe contener un valor." end
      def self.missing_fieldset_entry_with_key(key) "Falta la casilla de collecíon '#{key}' - si se proporcionó, mira por errores ortográficos y también distingue entre mayúsculas y minúsculas." end
      def self.missing_fieldset_for_fieldset_entry(line) "Línea #{line} contiene una casilla de collecíon sin una collecíon de casillas empezada antes." end
      def self.missing_fieldset_with_key(key) "Falta la collecíon de casillas '#{key}' - si se proporcionó, mira por errores ortográficos y también distingue entre mayúsculas y minúsculas." end
      def self.missing_list_for_list_item(line) "Línea #{line} contiene una entrada de lista sin una lista empezada antes." end
      def self.missing_list_item_value(key) "La lista '#{key}' no debe contener entradas vacías." end
      def self.missing_list_with_key(key) "Falta la lista '#{key}' - si se proporcionó, mira por errores ortográficos y también distingue entre mayúsculas y minúsculas." end
      def self.missing_section_with_key(key) "Falta la sección '#{key}' - si se proporcionó, mira por errores ortográficos y también distingue entre mayúsculas y minúsculas." end
      def self.non_section_element_not_found(line, key) "En la línea #{line} debe ser copiado el elemento no sección '#{key}', pero no se encontró." end
      def self.section_hierarchy_layer_skip(line) "Línea #{line} inicia una sección que es más de un nivel más bajo el actual." end
      def self.section_not_found(line, key) "En la línea #{line} debe ser copiado la sección '#{key}', pero no se encontró." end
      def self.two_or_more_templates_found(key) "Hay como mínimo dos elementos con la clave '#{key}' que se clasifiquen para estar copiado, no está claro cual debe ser copiado." end
      def self.unterminated_escaped_key(line) "En la línea #{line}, la clave de un elemento se escapa, pero esta secuencia de escape no termina hasta el final de la línea." end
      def self.unterminated_multiline_field(key, line) "La casilla de múltiples líneas '#{key}' que comienza en la línea #{line} no termina hasta el final del documento." end
      def self.value_error(message) "Hay un problema con el valor de este elemento: #{message}" end
    end
  end
end