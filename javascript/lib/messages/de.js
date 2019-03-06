//  GENERATED ON 2019-03-06T16:56:50 - DO NOT EDIT MANUALLY

exports.de = {
  contentHeader: 'Inhalt',
  expectedField: 'Ein Feld wurde erwartet.',
  expectedFields: 'Nur Felder wurden erwartet.',
  expectedFieldset: 'Ein Fieldset wurde erwartet.',
  expectedFieldsets: 'Nur Fieldsets wurden erwartet.',
  expectedList: 'Eine Liste wurde erwartet.',
  expectedLists: 'Nur Listen wurden erwartet.',
  expectedSection: 'Eine Sektion wurde erwartet.',
  expectedSections: 'Nur Sektionen wurden erwartet.',
  expectedSingleElement: 'Nur ein einzelnes Element wurde erwartet.',
  expectedSingleField: 'Nur ein einzelnes Feld wurde erwartet.',
  expectedSingleFieldset: 'Nur ein einzelnes Fieldset wurde erwartet.',
  expectedSingleFieldsetEntry: 'Nur ein einzelner Fieldset Eintrag wurde erwartet.',
  expectedSingleList: 'Nur eine einzelne Liste wurde erwartet.',
  expectedSingleSection: 'Nur eine einzelne Sektion wurde erwartet.',
  gutterHeader: 'Zeile',
  missingComment: 'Ein erforderlicher Kommentar zu diesem Feld fehlt.',
  missingElement: 'Ein einzelnes Element ist erforderlich - es kann einen beliebigen Schlüssel haben.',
  missingField: 'Ein einzelnes Feld ist erforderlich - es kann einen beliebigen Schlüssel haben.',
  missingFieldset: 'Ein einzelnes Fieldset ist erforderlich - es kann einen beliebigen Schlüssel haben.',
  missingFieldsetEntry: 'Ein einzelner Fieldset Eintrag ist erforderlich - er kann einen beliebigen Schlüssel haben.',
  missingList: 'Eine einzelne Liste ist erforderlich - sie kann einen beliebigen Schlüssel haben.',
  missingSection: 'Eine einzelne Sektion ist erforderlich - sie kann einen beliebigen Schlüssel haben.',
  unexpectedElement: 'Dieses Element wurde nicht erwartet, prüfe ob es am richtigen Platz ist und dass der Schlüssel keine Tippfehler enthält.',
  commentError: (message) => `Es gibt ein Problem mit dem Kommentar dieses Elements: ${message}`,
  cyclicDependency: (line, key) => `In Zeile ${line} wird '${key}' in sich selbst kopiert.`,
  expectedFieldWithKey: (key) => `Ein Feld mit dem Schlüssel '${key}' wurde erwartet.`,
  expectedFieldsWithKey: (key) => `Nur Felder mit dem Schlüssel '${key}' wurden erwartet.`,
  expectedFieldsetWithKey: (key) => `Ein Fieldset mit dem Schlüssel '${key}' wurde erwartet.`,
  expectedFieldsetsWithKey: (key) => `Nur Fieldsets mit dem Schlüssel '${key}' wurden erwartet.`,
  expectedListWithKey: (key) => `Eine Liste mit dem Schlüssel '${key}' wurde erwartet.`,
  expectedListsWithKey: (key) => `Nur Listen mit dem Schlüssel '${key}' wurden erwartet.`,
  expectedSectionWithKey: (key) => `Eine Sektion mit dem Schlüssel '${key}' wurde erwartet.`,
  expectedSectionsWithKey: (key) => `Nur Sektionen mit dem Schlüssel '${key}' wurden erwartet.`,
  expectedSingleElementWithKey: (key) => `Nur ein einzelnes Element mit dem Schlüssel '${key}' wurde erwartet.`,
  expectedSingleFieldWithKey: (key) => `Nur ein einzelnes Feld mit dem Schlüssel '${key}' wurde erwartet.`,
  expectedSingleFieldsetEntryWithKey: (key) => `Nur ein einzelner Fieldset Eintrag mit dem Schlüssel '${key}' wurde erwartet.`,
  expectedSingleFieldsetWithKey: (key) => `Nur ein einzelnes Fieldset mit dem Schlüssel '${key}' wurde erwartet.`,
  expectedSingleListWithKey: (key) => `Nur eine einzelne Liste mit dem Schlüssel '${key}' wurde erwartet.`,
  expectedSingleSectionWithKey: (key) => `Nur eine einzelne Sektion mit dem Schlüssel '${key}' wurde erwartet.`,
  invalidLine: (line) => `Zeile ${line} folgt keinem spezifierten Muster.`,
  keyError: (message) => `Es gibt ein Problem mit dem Schlüssel dieses Elements: ${message}`,
  missingElementForContinuation: (line) => `Zeile ${line} enthält eine Zeilenfortsetzung ohne dass davor ein fortsetzbares Element begonnen wurde.`,
  missingElementWithKey: (key) => `Das Element '${key}' fehlt - falls es angegeben wurde eventuell nach Tippfehlern Ausschau halten und auch die Gross/Kleinschreibung beachten.`,
  missingFieldValue: (key) => `Das Feld '${key}' muss einen Wert enthalten.`,
  missingFieldWithKey: (key) => `Das Feld '${key}' fehlt - falls es angegeben wurde eventuell nach Tippfehlern Ausschau halten und auch die Gross/Kleinschreibung beachten.`,
  missingFieldsetEntryValue: (key) => `Der Fieldset Eintrag '${key}' muss einen Wert enthalten.`,
  missingFieldsetEntryWithKey: (key) => `Der Fieldset Eintrag '${key}' fehlt - falls er angegeben wurde eventuell nach Tippfehlern Ausschau halten und auch die Gross/Kleinschreibung beachten.`,
  missingFieldsetForFieldsetEntry: (line) => `Zeile ${line} enthält einen Fieldset Eintrag ohne dass davor ein Fieldset begonnen wurde.`,
  missingFieldsetWithKey: (key) => `Das Fieldset '${key}' fehlt - falls es angegeben wurde eventuell nach Tippfehlern Ausschau halten und auch die Gross/Kleinschreibung beachten.`,
  missingListForListItem: (line) => `Zeile ${line} enthält einen Listeneintrag ohne dass davor ein eine Liste begonnen wurde.`,
  missingListItemValue: (key) => `Die Liste '${key}' darf keine leeren Einträge enthalten.`,
  missingListWithKey: (key) => `Die Liste '${key}' fehlt - falls sie angegeben wurde eventuell nach Tippfehlern Ausschau halten und auch die Gross/Kleinschreibung beachten.`,
  missingSectionWithKey: (key) => `Die Sektion '${key}' fehlt - falls sie angegeben wurde eventuell nach Tippfehlern Ausschau halten und auch die Gross/Kleinschreibung beachten.`,
  nonSectionElementNotFound: (line, key) => `In Zeile ${line} soll das Nicht-Sektions Element '${key}' kopiert werden, es wurde aber nicht gefunden.`,
  sectionHierarchyLayerSkip: (line) => `Zeile ${line} beginnt eine Sektion die mehr als eine Ebene tiefer liegt als die aktuelle.`,
  sectionNotFound: (line, key) => `In Zeile ${line} soll die Sektion '${key}' kopiert werden, sie wurde aber nicht gefunden.`,
  twoOrMoreTemplatesFound: (key) => `Es gibt mindestens zwei Elemente mit dem Schlüssel '${key}' die hier zum kopieren in Frage kommen, es ist nicht klar welches kopiert werden soll.`,
  unterminatedEscapedKey: (line) => `In Zeile ${line} wird der Schlüssel eines Elements escaped, jedoch wird diese Escape Sequenz bis zum Ende der Zeile nicht mehr beendet.`,
  unterminatedMultilineField: (key, line) => `Das Mehrzeilenfeld '${key}' dass in Zeile ${line} beginnt wird bis zum Ende des Dokuments nicht mehr beendet.`,
  valueError: (message) => `Es gibt ein Problem mit dem Wert dieses Elements: ${message}`
};