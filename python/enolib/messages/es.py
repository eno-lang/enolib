#  GENERATED ON 2019-03-27T16:01:07 - DO NOT EDIT MANUALLY

content_header = 'Contenido'
expected_empty = 'Se esperaba un elemento vacío.'
expected_field = 'Se esperaba una casilla.'
expected_fields = 'Solo se esperaban casillas.'
expected_fieldset = 'Se esperaba una collecíon de casillas.'
expected_fieldset_entry = 'Se esperaba una casilla de collecíon.'
expected_fieldsets = 'Solo se esperaban colleciones de casillas.'
expected_list = 'Se esperaba una lista.'
expected_list_item = 'Se esperaba una entrada de lista.'
expected_lists = 'Solo se esperaban listas.'
expected_section = 'Se esperaba una sección.'
expected_sections = 'Solo se esperaban secciones.'
expected_single_element = 'Solo se esperaba un único elemento.'
expected_single_empty = 'Solo se esperaba un único elemento vacío.'
expected_single_field = 'Solo se esperaba una sola casilla.'
expected_single_fieldset = 'Solo se esperaba una sola collecíon de casillas.'
expected_single_fieldset_entry = 'Solo se esperaba una sola casilla de collecíon.'
expected_single_list = 'Solo se esperaba una sola lista.'
expected_single_section = 'Solo se esperaba una sola sección.'
gutter_header = 'Línea'
missing_comment = 'Falta un comentario necesario para este elemento.'
missing_element = 'Se requiere un único elemento - puede tener cualquier clave.'
missing_empty = 'Se requiere un único elemento vacío - puede tener cualquier clave.'
missing_field = 'Se requiere una sola casilla - puede tener cualquier clave.'
missing_fieldset = 'Se requiere una sola collecíon de casillas - puede tener cualquier clave.'
missing_fieldset_entry = 'Se requiere una sola casilla de collecíon - puede tener cualquier clave.'
missing_list = 'Se requiere una sola lista - puede tener cualquier clave.'
missing_section = 'Se requiere una sola sección - puede tener cualquier clave.'
unexpected_element = 'Este elemento no se esperaba, averigua si es en el sitio correcto y que no contiene un error tipográfico la clave.'
comment_error = lambda message: f"Hay un problema con el comentario de este elemento: {message}"
cyclic_dependency = lambda line, key: f"En la línea {line} '{key}' se copia en sí mismo."
expected_empty_with_key = lambda key: f"Se esperaba un elemento vacío con la clave '{key}'."
expected_field_with_key = lambda key: f"Se esperaba una casilla con la clave '{key}'."
expected_fields_with_key = lambda key: f"Solo se esperaban casillas con la clave '{key}'."
expected_fieldset_with_key = lambda key: f"Se esperaba una collecíon de casillas con la clave '{key}'."
expected_fieldsets_with_key = lambda key: f"Solo se esperaban colleciones de casillas con la clave '{key}'."
expected_list_with_key = lambda key: f"Se esperaba una lista con la clave '{key}'."
expected_lists_with_key = lambda key: f"Solo se esperaban listas con la clave '{key}'."
expected_section_with_key = lambda key: f"Se esperaba una sección con la clave '{key}'."
expected_sections_with_key = lambda key: f"Solo se esperaban secciones con la clave '{key}'."
expected_single_element_with_key = lambda key: f"Solo se esperaba un único elemento con la clave '{key}'."
expected_single_empty_with_key = lambda key: f"Solo se esperaba un único elemento vacío con la clave '{key}'."
expected_single_field_with_key = lambda key: f"Solo se esperaba una sola casilla con la clave '{key}'."
expected_single_fieldset_entry_with_key = lambda key: f"Solo se esperaba una sola casilla de collecíon con la clave '{key}'."
expected_single_fieldset_with_key = lambda key: f"Solo se esperaba una sola collecíon de casillas con la clave '{key}'."
expected_single_list_with_key = lambda key: f"Solo se esperaba una sola lista con la clave '{key}'."
expected_single_section_with_key = lambda key: f"Solo se esperaba una sola sección con la clave '{key}'."
invalid_line = lambda line: f"Línea {line} no sigue un patrón especificado."
key_error = lambda message: f"Hay un problema con la clave de este elemento: {message}"
missing_element_for_continuation = lambda line: f"Línea {line} contiene una continuacíon de línea sin un elemento que se puede continuar empezado antes."
missing_element_with_key = lambda key: f"Falta el elemento '{key}' - si se proporcionó, mira por errores ortográficos y también distingue entre mayúsculas y minúsculas."
missing_empty_with_key = lambda key: f"Falta el elemento vacío '{key}' - si se proporcionó, mira por errores ortográficos y también distingue entre mayúsculas y minúsculas."
missing_field_value = lambda key: f"La casilla '{key}' debe contener un valor."
missing_field_with_key = lambda key: f"Falta la casilla '{key}' - si se proporcionó, mira por errores ortográficos y también distingue entre mayúsculas y minúsculas."
missing_fieldset_entry_value = lambda key: f"La casilla de collecíon '{key}' debe contener un valor."
missing_fieldset_entry_with_key = lambda key: f"Falta la casilla de collecíon '{key}' - si se proporcionó, mira por errores ortográficos y también distingue entre mayúsculas y minúsculas."
missing_fieldset_for_fieldset_entry = lambda line: f"Línea {line} contiene una casilla de collecíon sin una collecíon de casillas empezada antes."
missing_fieldset_with_key = lambda key: f"Falta la collecíon de casillas '{key}' - si se proporcionó, mira por errores ortográficos y también distingue entre mayúsculas y minúsculas."
missing_list_for_list_item = lambda line: f"Línea {line} contiene una entrada de lista sin una lista empezada antes."
missing_list_item_value = lambda key: f"La lista '{key}' no debe contener entradas vacías."
missing_list_with_key = lambda key: f"Falta la lista '{key}' - si se proporcionó, mira por errores ortográficos y también distingue entre mayúsculas y minúsculas."
missing_section_with_key = lambda key: f"Falta la sección '{key}' - si se proporcionó, mira por errores ortográficos y también distingue entre mayúsculas y minúsculas."
non_section_element_not_found = lambda line, key: f"En la línea {line} debe ser copiado el elemento no sección '{key}', pero no se encontró."
section_hierarchy_layer_skip = lambda line: f"Línea {line} inicia una sección que es más de un nivel más bajo el actual."
section_not_found = lambda line, key: f"En la línea {line} debe ser copiado la sección '{key}', pero no se encontró."
two_or_more_templates_found = lambda key: f"Hay como mínimo dos elementos con la clave '{key}' que se clasifiquen para estar copiado, no está claro cual debe ser copiado."
unterminated_escaped_key = lambda line: f"En la línea {line}, la clave de un elemento se escapa, pero esta secuencia de escape no termina hasta el final de la línea."
unterminated_multiline_field = lambda key, line: f"La casilla de múltiples líneas '{key}' que comienza en la línea {line} no termina hasta el final del documento."
value_error = lambda message: f"Hay un problema con el valor de este elemento: {message}"