<?php declare(strict_types=1);

//  GENERATED ON 2019-02-27T11:40:28 - DO NOT EDIT MANUALLY

namespace Eno\Messages;

class De {
  const CONTENT_HEADER = 'Inhalt';
  const GUTTER_HEADER = 'Zeile';
  const MISSING_COMMENT = 'Ein erforderlicher Kommentar zu diesem Feld fehlt.';
  const UNEXPECTED_ELEMENT = 'Dieses Element wurde nicht erwartet, prüfe ob es am richtigen Platz ist und dass der Schlüssel keine Tippfehler enthält.';
  public static function commentError($message) { return "Es gibt ein Problem mit dem Kommentar dieses Elements: {$message}"; }
  public static function cyclicDependency($line, $key) { return "In Zeile {$line} wird '{$key}' in sich selbst kopiert."; }
  public static function elementError($message) { return "Es gibt ein Problem mit diesem Element: {$message}"; }
  public static function expectedElementGotElements($key) { return "Statt dem erwarteten einzelnen Element '{$key}' wurden mehrere Elemente mit diesem Schlüssel vorgefunden."; }
  public static function expectedFieldGotFields($key) { return "Statt dem erwarteten einzelnen Feld '{$key}' wurden mehrere Felder mit diesem Schlüssel vorgefunden."; }
  public static function expectedFieldGotFieldset($key) { return "Statt dem erwarteten Feld '{$key}' wurde ein Fieldset mit diesem Schlüssel vorgefunden."; }
  public static function expectedFieldGotList($key) { return "Statt dem erwarteten Feld '{$key}' wurde eine Liste mit diesem Schlüssel vorgefunden."; }
  public static function expectedFieldGotSection($key) { return "Statt dem erwarteten Feld '{$key}' wurde eine Sektion mit diesem Schlüssel vorgefunden."; }
  public static function expectedFieldsGotFieldset($key) { return "Es wurden nur Felder mit dem Schlüssel '{$key}' erwartet, jedoch ein Fieldset mit diesem Schlüssel vorgefunden."; }
  public static function expectedFieldsGotList($key) { return "Es wurden nur Felder mit dem Schlüssel '{$key}' erwartet, jedoch eine Liste mit diesem Schlüssel vorgefunden."; }
  public static function expectedFieldsGotSection($key) { return "Es wurden nur Felder mit dem Schlüssel '{$key}' erwartet, jedoch eine Sektion mit diesem Schlüssel vorgefunden."; }
  public static function expectedFieldsetEntryGotFieldsetEntries($key) { return "Statt dem erwarteten einzelnen Fieldset Eintrag '{$key}' wurden mehrere Fieldset Einträge mit diesem Schlüssel vorgefunden."; }
  public static function expectedFieldsetGotField($key) { return "Statt dem erwarteten Fieldset '{$key}' wurde ein Feld mit diesem Schlüssel vorgefunden."; }
  public static function expectedFieldsetGotFieldsets($key) { return "Statt dem erwarteten einzelnen Fieldset '{$key}' wurden mehrere Fieldsets mit diesem Schlüssel vorgefunden."; }
  public static function expectedFieldsetGotList($key) { return "Statt dem erwarteten Fieldset '{$key}' wurde eine Liste mit diesem Schlüssel vorgefunden."; }
  public static function expectedFieldsetGotSection($key) { return "Statt dem erwarteten Fieldset '{$key}' wurde eine Sektion mit diesem Schlüssel vorgefunden."; }
  public static function expectedFieldsetsGotField($key) { return "Es wurden nur Fieldsets mit dem Schlüssel '{$key}' erwartet, jedoch ein Feld mit diesem Schlüssel vorgefunden."; }
  public static function expectedFieldsetsGotList($key) { return "Es wurden nur Fieldsets mit dem Schlüssel '{$key}' erwartet, jedoch eine Liste mit diesem Schlüssel vorgefunden."; }
  public static function expectedFieldsetsGotSection($key) { return "Es wurden nur Fieldsets mit dem Schlüssel '{$key}' erwartet, jedoch eine Sektion mit diesem Schlüssel vorgefunden."; }
  public static function expectedListGotField($key) { return "Statt der erwarteten Liste '{$key}' wurde ein Feld mit diesem Schlüssel vorgefunden."; }
  public static function expectedListGotFieldset($key) { return "Statt der erwarteten Liste '{$key}' wurde ein Fieldset mit diesem Schlüssel vorgefunden."; }
  public static function expectedListGotLists($key) { return "Statt der erwarteten einzelnen Liste '{$key}' wurden mehrere Listen mit diesem Schlüssel vorgefunden."; }
  public static function expectedListGotSection($key) { return "Statt der erwarteten Liste '{$key}' wurde eine Sektion mit diesem Schlüssel vorgefunden."; }
  public static function expectedListsGotField($key) { return "Es wurden nur Listen mit dem Schlüssel '{$key}' erwartet, jedoch ein Feld mit diesem Schlüssel vorgefunden."; }
  public static function expectedListsGotFieldset($key) { return "Es wurden nur Listen mit dem Schlüssel '{$key}' erwartet, jedoch ein Fieldset mit diesem Schlüssel vorgefunden."; }
  public static function expectedListsGotSection($key) { return "Es wurden nur Listen mit dem Schlüssel '{$key}' erwartet, jedoch eine Sektion mit diesem Schlüssel vorgefunden."; }
  public static function expectedSectionGotEmpty($key) { return "Statt der erwarteten Sektion '{$key}' wurde ein leeres Element mit diesem Schlüssel vorgefunden."; }
  public static function expectedSectionGotField($key) { return "Statt der erwarteten Sektion '{$key}' wurde ein Feld mit diesem Schlüssel vorgefunden."; }
  public static function expectedSectionGotFieldset($key) { return "Statt der erwarteten Sektion '{$key}' wurde ein Fieldset mit diesem Schlüssel vorgefunden."; }
  public static function expectedSectionGotList($key) { return "Statt der erwarteten Sektion '{$key}' wurde eine Liste mit diesem Schlüssel vorgefunden."; }
  public static function expectedSectionGotSections($key) { return "Statt der erwarteten einzelnen Sektion '{$key}' wurden mehrere Sektionen mit diesem Schlüssel vorgefunden."; }
  public static function expectedSectionsGotEmpty($key) { return "Es wurden nur Sektionen mit dem Schlüssel '{$key}' erwartet, jedoch ein leeres Element mit diesem Schlüssel vorgefunden."; }
  public static function expectedSectionsGotField($key) { return "Es wurden nur Sektionen mit dem Schlüssel '{$key}' erwartet, jedoch ein Feld mit diesem Schlüssel vorgefunden."; }
  public static function expectedSectionsGotFieldset($key) { return "Es wurden nur Sektionen mit dem Schlüssel '{$key}' erwartet, jedoch ein Fieldset mit diesem Schlüssel vorgefunden."; }
  public static function expectedSectionsGotList($key) { return "Es wurden nur Sektionen mit dem Schlüssel '{$key}' erwartet, jedoch eine Liste mit diesem Schlüssel vorgefunden."; }
  public static function invalidLine($line) { return "Zeile {$line} folgt keinem spezifierten Muster."; }
  public static function keyError($message) { return "Es gibt ein Problem mit dem Schlüssel dieses Elements: {$message}"; }
  public static function missingElement($key) { return "Das Element '{$key}' fehlt - falls es angegeben wurde eventuell nach Tippfehlern Ausschau halten und auch die Gross/Kleinschreibung beachten."; }
  public static function missingElementForContinuation($line) { return "Zeile {$line} enthält eine Zeilenfortsetzung ohne dass davor ein fortsetzbares Element begonnen wurde."; }
  public static function missingField($key) { return "Das Feld '{$key}' fehlt - falls es angegeben wurde eventuell nach Tippfehlern Ausschau halten und auch die Gross/Kleinschreibung beachten."; }
  public static function missingFieldValue($key) { return "Das Feld '{$key}' muss einen Wert enthalten."; }
  public static function missingFieldset($key) { return "Das Fieldset '{$key}' fehlt - falls es angegeben wurde eventuell nach Tippfehlern Ausschau halten und auch die Gross/Kleinschreibung beachten."; }
  public static function missingFieldsetEntry($key) { return "Der Fieldset Eintrag '{$key}' fehlt - falls er angegeben wurde eventuell nach Tippfehlern Ausschau halten und auch die Gross/Kleinschreibung beachten."; }
  public static function missingFieldsetEntryValue($key) { return "Der Fieldset Eintrag '{$key}' muss einen Wert enthalten."; }
  public static function missingFieldsetForFieldsetEntry($line) { return "Zeile {$line} enthält einen Fieldset Eintrag ohne dass davor ein Fieldset begonnen wurde."; }
  public static function missingList($key) { return "Die Liste '{$key}' fehlt - falls sie angegeben wurde eventuell nach Tippfehlern Ausschau halten und auch die Gross/Kleinschreibung beachten."; }
  public static function missingListForListItem($line) { return "Zeile {$line} enthält einen Listeneintrag ohne dass davor ein eine Liste begonnen wurde."; }
  public static function missingListItemValue($key) { return "Die Liste '{$key}' darf keine leeren Einträge enthalten."; }
  public static function missingSection($key) { return "Die Sektion '{$key}' fehlt - falls sie angegeben wurde eventuell nach Tippfehlern Ausschau halten und auch die Gross/Kleinschreibung beachten."; }
  public static function nonSectionElementNotFound($line, $key) { return "In Zeile {$line} soll das Nicht-Sektions Element '{$key}' kopiert werden, es wurde aber nicht gefunden."; }
  public static function sectionHierarchyLayerSkip($line) { return "Zeile {$line} beginnt eine Sektion die mehr als eine Ebene tiefer liegt als die aktuelle."; }
  public static function sectionNotFound($line, $key) { return "In Zeile {$line} soll die Sektion '{$key}' kopiert werden, sie wurde aber nicht gefunden."; }
  public static function twoOrMoreTemplatesFound($key) { return "Es gibt mindestens zwei Elemente mit dem Schlüssel '{$key}' die hier zum kopieren in Frage kommen, es ist nicht klar welches kopiert werden soll."; }
  public static function unterminatedEscapedKey($line) { return "In Zeile {$line} wird der Schlüssel eines Elements escaped, jedoch wird diese Escape Sequenz bis zum Ende der Zeile nicht mehr beendet."; }
  public static function unterminatedMultilineField($key, $line) { return "Das Mehrzeilenfeld '{$key}' dass in Zeile {$line} beginnt wird bis zum Ende des Dokuments nicht mehr beendet."; }
  public static function valueError($message) { return "Es gibt ein Problem mit dem Wert dieses Elements: {$message}"; }
}