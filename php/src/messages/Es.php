<?php declare(strict_types=1);

//  GENERATED ON 2019-02-27T11:40:28 - DO NOT EDIT MANUALLY

namespace Eno\Messages;

class Es {
  const CONTENT_HEADER = 'Contenido';
  const GUTTER_HEADER = 'Línea';
  const MISSING_COMMENT = 'Falta un comentario necesario para este elemento.';
  const UNEXPECTED_ELEMENT = 'Este elemento no se esperaba, averigua si es en el sitio correcto y que no contiene un error tipográfico la clave.';
  public static function commentError($message) { return "Hay un problema con el comentario de este elemento: {$message}"; }
  public static function cyclicDependency($line, $key) { return "En la línea {$line} '{$key}' se copia en sí mismo."; }
  public static function elementError($message) { return "Hay un problema con este elemento: {$message}"; }
  public static function expectedElementGotElements($key) { return "En lugar del único esperado elemento '{$key}' se encontraron varios elementos con esta clave."; }
  public static function expectedFieldGotFields($key) { return "En lugar de la única casilla esperada '{$key}' se encontraron varias casillas con esta clave."; }
  public static function expectedFieldGotFieldset($key) { return "En lugar de la casilla '{$key}' esperada se encontró una collecíon de casillas con esta clave."; }
  public static function expectedFieldGotList($key) { return "En lugar de la casilla '{$key}' esperada se encontró una lista con esta clave."; }
  public static function expectedFieldGotSection($key) { return "En lugar de la casilla '{$key}' esperada se encontró una sección con esta clave."; }
  public static function expectedFieldsGotFieldset($key) { return "Solo se esperaban casillas con la clave '{$key}', pero se encontró una collecíon de casillas con esta clave."; }
  public static function expectedFieldsGotList($key) { return "Solo se esperaban casillas con la clave '{$key}', pero se encontró una lista con esta clave."; }
  public static function expectedFieldsGotSection($key) { return "Solo se esperaban casillas con la clave '{$key}', pero se encontró una sección con esta clave."; }
  public static function expectedFieldsetEntryGotFieldsetEntries($key) { return "En lugar de la única esperada casilla de collecíon '{$key}' se encontraron varias casillas de collecion con esta clave."; }
  public static function expectedFieldsetGotField($key) { return "En lugar de la collecíon de casillas '{$key}' esperada se encontró una casilla con esta clave."; }
  public static function expectedFieldsetGotFieldsets($key) { return "En lugar de la única esperada collecíon de casillas '{$key}' se encontraron varias collecíones de casillas con esta clave."; }
  public static function expectedFieldsetGotList($key) { return "En lugar de la collecíon de casillas '{$key}' esperada se encontró una lista con esta clave."; }
  public static function expectedFieldsetGotSection($key) { return "En lugar de la collecíon de casillas '{$key}' esperada se encontró una sección con esta clave."; }
  public static function expectedFieldsetsGotField($key) { return "Solo se esperaban collecíones de casillas con la clave '{$key}', pero se encontró una casilla con esta clave."; }
  public static function expectedFieldsetsGotList($key) { return "Solo se esperaban collecíones de casillas con la clave '{$key}', pero se encontró una lista con esta clave."; }
  public static function expectedFieldsetsGotSection($key) { return "Solo se esperaban collecíones de casillas con la clave '{$key}', pero se encontró una sección con esta clave."; }
  public static function expectedListGotField($key) { return "En lugar de la lista '{$key}' esperada se encontró una casilla con esta clave."; }
  public static function expectedListGotFieldset($key) { return "En lugar de la lista '{$key}' esperada se encontró una collecíon de casillas con esta clave."; }
  public static function expectedListGotLists($key) { return "En lugar de la única lista esperada '{$key}' se encontraron varias listas con esta clave."; }
  public static function expectedListGotSection($key) { return "En lugar de la lista '{$key}' esperada se encontró una sección con esta clave."; }
  public static function expectedListsGotField($key) { return "Solo se esperaban listas con la clave '{$key}', pero se encontró una casilla con esta clave."; }
  public static function expectedListsGotFieldset($key) { return "Solo se esperaban listas con la clave '{$key}', pero se encontró una collecíon de casillas con esta clave."; }
  public static function expectedListsGotSection($key) { return "Solo se esperaban listas con la clave '{$key}', pero se encontró una sección con esta clave."; }
  public static function expectedSectionGotEmpty($key) { return "En lugar de la sección '{$key}' esperada se encontró un elemento vacío con esta clave."; }
  public static function expectedSectionGotField($key) { return "En lugar de la sección '{$key}' esperada se encontró una casilla con esta clave."; }
  public static function expectedSectionGotFieldset($key) { return "En lugar de la sección '{$key}' esperada se encontró una collecíon de casillas con esta clave."; }
  public static function expectedSectionGotList($key) { return "En lugar de la sección '{$key}' esperada se encontró una lista con esta clave."; }
  public static function expectedSectionGotSections($key) { return "En lugar de la única sección esperada '{$key}' se encontraron varias secciones con esta clave."; }
  public static function expectedSectionsGotEmpty($key) { return "Solo se esperaban secciones con la clave '{$key}', pero se encontró un elemento vacío con esta clave."; }
  public static function expectedSectionsGotField($key) { return "Solo se esperaban secciones con la clave '{$key}', pero se encontró una casilla con esta clave."; }
  public static function expectedSectionsGotFieldset($key) { return "Solo se esperaban secciones con la clave '{$key}', pero se encontró una collecíon de casillas con esta clave."; }
  public static function expectedSectionsGotList($key) { return "Solo se esperaban secciones con la clave '{$key}', pero se encontró una lista con esta clave."; }
  public static function invalidLine($line) { return "Línea {$line} no sigue un patrón especificado."; }
  public static function keyError($message) { return "Hay un problema con la clave de este elemento: {$message}"; }
  public static function missingElement($key) { return "Falta el elemento '{$key}' - si se proporcionó, mira por errores ortográficos y también distingue entre mayúsculas y minúsculas."; }
  public static function missingElementForContinuation($line) { return "Línea {$line} contiene una continuacíon de línea sin un elemento que se puede continuar empezado antes."; }
  public static function missingField($key) { return "Falta la casilla '{$key}' - si se proporcionó, mira por errores ortográficos y también distingue entre mayúsculas y minúsculas."; }
  public static function missingFieldValue($key) { return "La casilla '{$key}' debe contener un valor."; }
  public static function missingFieldset($key) { return "Falta la collecíon de casillas '{$key}' - si se proporcionó, mira por errores ortográficos y también distingue entre mayúsculas y minúsculas."; }
  public static function missingFieldsetEntry($key) { return "Falta la casilla de collecíon '{$key}' - si se proporcionó, mira por errores ortográficos y también distingue entre mayúsculas y minúsculas."; }
  public static function missingFieldsetEntryValue($key) { return "La casilla de collecíon '{$key}' debe contener un valor."; }
  public static function missingFieldsetForFieldsetEntry($line) { return "Línea {$line} contiene una casilla de collecíon sin una collecíon de casillas empezada antes."; }
  public static function missingList($key) { return "Falta la lista '{$key}' - si se proporcionó, mira por errores ortográficos y también distingue entre mayúsculas y minúsculas."; }
  public static function missingListForListItem($line) { return "Línea {$line} contiene una entrada de lista sin una lista empezada antes."; }
  public static function missingListItemValue($key) { return "La lista '{$key}' no debe contener entradas vacías."; }
  public static function missingSection($key) { return "Falta la sección '{$key}' - si se proporcionó, mira por errores ortográficos y también distingue entre mayúsculas y minúsculas."; }
  public static function nonSectionElementNotFound($line, $key) { return "En la línea {$line} debe ser copiado el elemento no sección '{$key}', pero no se encontró."; }
  public static function sectionHierarchyLayerSkip($line) { return "Línea {$line} inicia una sección que es más de un nivel más bajo el actual."; }
  public static function sectionNotFound($line, $key) { return "En la línea {$line} debe ser copiado la sección '{$key}', pero no se encontró."; }
  public static function twoOrMoreTemplatesFound($key) { return "Hay como mínimo dos elementos con la clave '{$key}' que se clasifiquen para estar copiado, no está claro cual debe ser copiado."; }
  public static function unterminatedEscapedKey($line) { return "En la línea {$line}, la clave de un elemento se escapa, pero esta secuencia de escape no termina hasta el final de la línea."; }
  public static function unterminatedMultilineField($key, $line) { return "La casilla de múltiples líneas '{$key}' que comienza en la línea {$line} no termina hasta el final del documento."; }
  public static function valueError($message) { return "Hay un problema con el valor de este elemento: {$message}"; }
}