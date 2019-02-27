<?php declare(strict_types=1);

//  GENERATED ON 2019-02-27T11:40:28 - DO NOT EDIT MANUALLY

namespace Eno\Messages;

class En {
  const CONTENT_HEADER = 'Content';
  const GUTTER_HEADER = 'Line';
  const MISSING_COMMENT = 'A required comment for this element is missing.';
  const UNEXPECTED_ELEMENT = 'This element was not expected, make sure it is at the right place in the document and that its key is not mis-typed.';
  public static function commentError($message) { return "There is a problem with the comment of this element: {$message}"; }
  public static function cyclicDependency($line, $key) { return "In line {$line} '{$key}' is copied into itself."; }
  public static function elementError($message) { return "There is a problem with this element: {$message}"; }
  public static function expectedElementGotElements($key) { return "Instead of the expected single element '{$key}' several elements with this key were found."; }
  public static function expectedFieldGotFields($key) { return "Instead of the expected single field '{$key}' several fields with this key were found."; }
  public static function expectedFieldGotFieldset($key) { return "Instead of the expected field '{$key}' a fieldset with this key was found."; }
  public static function expectedFieldGotList($key) { return "Instead of the expected field '{$key}' a list with this key was found."; }
  public static function expectedFieldGotSection($key) { return "Instead of the expected field '{$key}' a section with this key was found."; }
  public static function expectedFieldsGotFieldset($key) { return "Only fields with the key '{$key}' were expected, but a fieldset with this key was found."; }
  public static function expectedFieldsGotList($key) { return "Only fields with the key '{$key}' were expected, but a list with this key was found."; }
  public static function expectedFieldsGotSection($key) { return "Only fields with the key '{$key}' were expected, but a section with this key was found."; }
  public static function expectedFieldsetEntryGotFieldsetEntries($key) { return "Instead of the expected single fieldset entry '{$key}' several fieldset entries with this key were found."; }
  public static function expectedFieldsetGotField($key) { return "Instead of the expected fieldset '{$key}' a field with this key was found."; }
  public static function expectedFieldsetGotFieldsets($key) { return "Instead of the expected single fieldset '{$key}' several fieldsets with this key were found."; }
  public static function expectedFieldsetGotList($key) { return "Instead of the expected fieldset '{$key}' a list with this key was found."; }
  public static function expectedFieldsetGotSection($key) { return "Instead of the expected fieldset '{$key}' a section with this key was found."; }
  public static function expectedFieldsetsGotField($key) { return "Only fieldsets with the key '{$key}' were expected, but a field with this key was found."; }
  public static function expectedFieldsetsGotList($key) { return "Only fieldsets with the key '{$key}' were expected, but a list with this key was found."; }
  public static function expectedFieldsetsGotSection($key) { return "Only fieldsets with the key '{$key}' were expected, but a section with this key was found."; }
  public static function expectedListGotField($key) { return "Instead of the expected list '{$key}' a field with this key was found."; }
  public static function expectedListGotFieldset($key) { return "Instead of the expected list '{$key}' a fieldset with this key was found."; }
  public static function expectedListGotLists($key) { return "Instead of the expected single list '{$key}' several lists with this key were found."; }
  public static function expectedListGotSection($key) { return "Instead of the expected list '{$key}' a section with this key was found."; }
  public static function expectedListsGotField($key) { return "Only lists with the key '{$key}' were expected, but a field with this key was found."; }
  public static function expectedListsGotFieldset($key) { return "Only lists with the key '{$key}' were expected, but a fieldset with this key was found."; }
  public static function expectedListsGotSection($key) { return "Only lists with the key '{$key}' were expected, but a section with this key was found."; }
  public static function expectedSectionGotEmpty($key) { return "Instead of the expected section '{$key}' an empty element with this key was found."; }
  public static function expectedSectionGotField($key) { return "Instead of the expected section '{$key}' a field with this key was found."; }
  public static function expectedSectionGotFieldset($key) { return "Instead of the expected section '{$key}' a fieldset with this key was found."; }
  public static function expectedSectionGotList($key) { return "Instead of the expected section '{$key}' a list with this key was found."; }
  public static function expectedSectionGotSections($key) { return "Instead of the expected single section '{$key}' several sections with this key were found."; }
  public static function expectedSectionsGotEmpty($key) { return "Only sections with the key '{$key}' were expected, but an empty element with this key was found."; }
  public static function expectedSectionsGotField($key) { return "Only sections with the key '{$key}' were expected, but a field with this key was found."; }
  public static function expectedSectionsGotFieldset($key) { return "Only sections with the key '{$key}' were expected, but a fieldset with this key was found."; }
  public static function expectedSectionsGotList($key) { return "Only sections with the key '{$key}' were expected, but a list with this key was found."; }
  public static function invalidLine($line) { return "Line {$line} does not follow any specified pattern."; }
  public static function keyError($message) { return "There is a problem with the key of this element: {$message}"; }
  public static function missingElement($key) { return "The element '{$key}' is missing - in case it has been specified look for typos and also check for correct capitalization."; }
  public static function missingElementForContinuation($line) { return "Line {$line} contains a line continuation without a continuable element being specified before."; }
  public static function missingField($key) { return "The field '{$key}' is missing - in case it has been specified look for typos and also check for correct capitalization."; }
  public static function missingFieldValue($key) { return "The field '{$key}' must contain a value."; }
  public static function missingFieldset($key) { return "The fieldset '{$key}' is missing - in case it has been specified look for typos and also check for correct capitalization."; }
  public static function missingFieldsetEntry($key) { return "The fieldset entry '{$key}' is missing - in case it has been specified look for typos and also check for correct capitalization."; }
  public static function missingFieldsetEntryValue($key) { return "The fieldset entry '{$key}' must contain a value."; }
  public static function missingFieldsetForFieldsetEntry($line) { return "Line {$line} contains a fieldset entry without a fieldset being specified before."; }
  public static function missingList($key) { return "The list '{$key}' is missing - in case it has been specified look for typos and also check for correct capitalization."; }
  public static function missingListForListItem($line) { return "Line {$line} contains a list item without a list being specified before."; }
  public static function missingListItemValue($key) { return "The list '{$key}' may not contain empty items."; }
  public static function missingSection($key) { return "The section '{$key}' is missing - in case it has been specified look for typos and also check for correct capitalization."; }
  public static function nonSectionElementNotFound($line, $key) { return "In line {$line} the non-section element '{$key}' should be copied, but it was not found."; }
  public static function sectionHierarchyLayerSkip($line) { return "Line {$line} starts a section that is more than one level deeper than the current one."; }
  public static function sectionNotFound($line, $key) { return "In line {$line} the section '{$key}' should be copied, but it was not found."; }
  public static function twoOrMoreTemplatesFound($key) { return "There are at least two elements with the key '{$key}' that qualify for being copied here, it is not clear which to copy."; }
  public static function unterminatedEscapedKey($line) { return "In line {$line} the key of an element is escaped, but the escape sequence is not terminated until the end of the line."; }
  public static function unterminatedMultilineField($key, $line) { return "The multiline field '{$key}' starting in line {$line} is not terminated until the end of the document."; }
  public static function valueError($message) { return "There is a problem with the value of this element: {$message}"; }
}