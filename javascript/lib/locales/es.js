//  GENERATED ON 2022-03-29T14:08:57 - DO NOT EDIT MANUALLY

module.exports = {
  contentHeader: 'Contenido',
  expectedDocument: 'Se esperaba el documento.',
  expectedEmpty: 'Se esperaba un elemento vacío.',
  expectedField: 'Se esperaba una casilla.',
  expectedFields: 'Solo se esperaban casillas.',
  expectedFieldset: 'Se esperaba una collecíon de casillas.',
  expectedFieldsetEntry: 'Se esperaba una casilla de collecíon.',
  expectedFieldsets: 'Solo se esperaban colleciones de casillas.',
  expectedList: 'Se esperaba una lista.',
  expectedListItem: 'Se esperaba una entrada de lista.',
  expectedLists: 'Solo se esperaban listas.',
  expectedSection: 'Se esperaba una sección.',
  expectedSections: 'Solo se esperaban secciones.',
  expectedSingleElement: 'Solo se esperaba un único elemento.',
  expectedSingleEmpty: 'Solo se esperaba un único elemento vacío.',
  expectedSingleField: 'Solo se esperaba una sola casilla.',
  expectedSingleFieldset: 'Solo se esperaba una sola collecíon de casillas.',
  expectedSingleFieldsetEntry: 'Solo se esperaba una sola casilla de collecíon.',
  expectedSingleList: 'Solo se esperaba una sola lista.',
  expectedSingleSection: 'Solo se esperaba una sola sección.',
  gutterHeader: 'Línea',
  missingComment: 'Falta un comentario necesario para este elemento.',
  missingElement: 'Se requiere un único elemento - puede tener cualquier clave.',
  missingEmpty: 'Se requiere un único elemento vacío - puede tener cualquier clave.',
  missingField: 'Se requiere una sola casilla - puede tener cualquier clave.',
  missingFieldset: 'Se requiere una sola collecíon de casillas - puede tener cualquier clave.',
  missingFieldsetEntry: 'Se requiere una sola casilla de collecíon - puede tener cualquier clave.',
  missingList: 'Se requiere una sola lista - puede tener cualquier clave.',
  missingSection: 'Se requiere una sola sección - puede tener cualquier clave.',
  unexpectedElement: 'Este elemento no se esperaba, averigua si es en el sitio correcto y que no contiene un error tipográfico la clave.',
  commentError: (message) => `Hay un problema con el comentario de este elemento: ${message}`,
  expectedEmptyWithKey: (key) => `Se esperaba un elemento vacío con la clave '${key}'.`,
  expectedFieldWithKey: (key) => `Se esperaba una casilla con la clave '${key}'.`,
  expectedFieldsWithKey: (key) => `Solo se esperaban casillas con la clave '${key}'.`,
  expectedFieldsetWithKey: (key) => `Se esperaba una collecíon de casillas con la clave '${key}'.`,
  expectedFieldsetsWithKey: (key) => `Solo se esperaban colleciones de casillas con la clave '${key}'.`,
  expectedListWithKey: (key) => `Se esperaba una lista con la clave '${key}'.`,
  expectedListsWithKey: (key) => `Solo se esperaban listas con la clave '${key}'.`,
  expectedSectionWithKey: (key) => `Se esperaba una sección con la clave '${key}'.`,
  expectedSectionsWithKey: (key) => `Solo se esperaban secciones con la clave '${key}'.`,
  expectedSingleElementWithKey: (key) => `Solo se esperaba un único elemento con la clave '${key}'.`,
  expectedSingleEmptyWithKey: (key) => `Solo se esperaba un único elemento vacío con la clave '${key}'.`,
  expectedSingleFieldWithKey: (key) => `Solo se esperaba una sola casilla con la clave '${key}'.`,
  expectedSingleFieldsetEntryWithKey: (key) => `Solo se esperaba una sola casilla de collecíon con la clave '${key}'.`,
  expectedSingleFieldsetWithKey: (key) => `Solo se esperaba una sola collecíon de casillas con la clave '${key}'.`,
  expectedSingleListWithKey: (key) => `Solo se esperaba una sola lista con la clave '${key}'.`,
  expectedSingleSectionWithKey: (key) => `Solo se esperaba una sola sección con la clave '${key}'.`,
  invalidLine: (line) => `Línea ${line} no sigue un patrón especificado.`,
  keyError: (message) => `Hay un problema con la clave de este elemento: ${message}`,
  missingElementForContinuation: (line) => `Línea ${line} contiene una continuacíon de línea sin un elemento que se puede continuar empezado antes.`,
  missingElementWithKey: (key) => `Falta el elemento '${key}' - si se proporcionó, mira por errores ortográficos y también distingue entre mayúsculas y minúsculas.`,
  missingEmptyWithKey: (key) => `Falta el elemento vacío '${key}' - si se proporcionó, mira por errores ortográficos y también distingue entre mayúsculas y minúsculas.`,
  missingFieldValue: (key) => `La casilla '${key}' debe contener un valor.`,
  missingFieldWithKey: (key) => `Falta la casilla '${key}' - si se proporcionó, mira por errores ortográficos y también distingue entre mayúsculas y minúsculas.`,
  missingFieldsetEntryValue: (key) => `La casilla de collecíon '${key}' debe contener un valor.`,
  missingFieldsetEntryWithKey: (key) => `Falta la casilla de collecíon '${key}' - si se proporcionó, mira por errores ortográficos y también distingue entre mayúsculas y minúsculas.`,
  missingFieldsetForFieldsetEntry: (line) => `Línea ${line} contiene una casilla de collecíon sin una collecíon de casillas empezada antes.`,
  missingFieldsetWithKey: (key) => `Falta la collecíon de casillas '${key}' - si se proporcionó, mira por errores ortográficos y también distingue entre mayúsculas y minúsculas.`,
  missingListForListItem: (line) => `Línea ${line} contiene una entrada de lista sin una lista empezada antes.`,
  missingListItemValue: (key) => `La lista '${key}' no debe contener entradas vacías.`,
  missingListWithKey: (key) => `Falta la lista '${key}' - si se proporcionó, mira por errores ortográficos y también distingue entre mayúsculas y minúsculas.`,
  missingSectionWithKey: (key) => `Falta la sección '${key}' - si se proporcionó, mira por errores ortográficos y también distingue entre mayúsculas y minúsculas.`,
  sectionHierarchyLayerSkip: (line) => `Línea ${line} inicia una sección que es más de un nivel más bajo el actual.`,
  unterminatedEscapedKey: (line) => `En la línea ${line}, la clave de un elemento se escapa, pero esta secuencia de escape no termina hasta el final de la línea.`,
  unterminatedMultilineField: (key, line) => `La casilla de múltiples líneas '${key}' que comienza en la línea ${line} no termina hasta el final del documento.`,
  valueError: (message) => `Hay un problema con el valor de este elemento: ${message}`
};