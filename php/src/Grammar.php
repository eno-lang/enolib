<?php declare(strict_types=1);

namespace Eno;

// Note: Study this file from the bottom up

class Grammar {
  const OPTIONAL = '([^\\n]+?)?';
  const REQUIRED = '(\\S[^\\n]*?)';

  //
  const EMPTY = '()';
  const EMPTY_LINE_INDEX = 1;

  // | value
  const DIRECT_LINE_CONTINUATION = '(\\|)[^\\S\\n]*'.self::OPTIONAL;
  const DIRECT_LINE_CONTINUATION_OPERATOR_INDEX = 2;
  const DIRECT_LINE_CONTINUATION_VALUE_INDEX = 3;

  // \ value
  const SPACED_LINE_CONTINUATION = '(\\\\)[^\\S\\n]*'.self::OPTIONAL;
  const SPACED_LINE_CONTINUATION_OPERATOR_INDEX = 4;
  const SPACED_LINE_CONTINUATION_VALUE_INDEX = 5;

  const CONTINUATION = self::DIRECT_LINE_CONTINUATION.'|'.self::SPACED_LINE_CONTINUATION;

  // > comment
  const COMMENT = '(>)([^\\n]*)';
  const COMMENT_OPERATOR_INDEX = 6;
  const COMMENT_VALUE_INDEX = 7;

  // - value
  const LIST_ITEM = '(-)(?!-)[^\\S\\n]*'.self::OPTIONAL;
  const LIST_ITEM_OPERATOR_INDEX = 8;
  const LIST_ITEM_VALUE_INDEX = 9;

  // -- key
  const MULTILINE_FIELD = '(--++)[^\\S\\n]*'.self::REQUIRED;
  const MULTILINE_FIELD_OPERATOR_INDEX = 10;
  const MULTILINE_FIELD_KEY_INDEX = 11;

  // #
  const SECTION_OPERATOR = '(#++)';
  const SECTION_OPERATOR_INDEX = 12;

  // # key
  const SECTION_KEY_UNESCAPED = '([^\\s`<][^<\\n]*?)';
  const SECTION_KEY_UNESCAPED_INDEX = 13;

  // # `key`
  const SECTION_KEY_ESCAPE_BEGIN_OPERATOR_INDEX = 14;
  const SECTION_KEY_ESCAPED = '(`++)[^\\S\\n]*(\\S[^\\n]*?)[^\\S\\n]*(\\'.self::SECTION_KEY_ESCAPE_BEGIN_OPERATOR_INDEX.')'; // TODO: Should this exclude the backreference inside the quotes? (as in ((?:(?!\1).)+) ) here and elsewhere (probably not because it's not greedy.?!
  const SECTION_KEY_ESCAPED_INDEX = 15;
  const SECTION_KEY_ESCAPE_END_OPERATOR_INDEX = 16;

  // # key < template
  // # `key` < template
  const SECTION_KEY = '(?:'.self::SECTION_KEY_UNESCAPED.'|'.self::SECTION_KEY_ESCAPED.')';
  const SECTION_TEMPLATE = '(?:(<(?!<)|<<)[^\\S\\n]*'.self::REQUIRED.')?';
  const SECTION = self::SECTION_OPERATOR.'\\s*'.self::SECTION_KEY.'[^\\S\\n]*'.self::SECTION_TEMPLATE;
  const SECTION_COPY_OPERATOR_INDEX = 17;
  const SECTION_TEMPLATE_INDEX = 18;

  const EARLY_DETERMINED = self::CONTINUATION.'|'.self::COMMENT.'|'.self::LIST_ITEM.'|'.self::MULTILINE_FIELD.'|'.self::SECTION;

  // key:
  // key: value
  const KEY_UNESCAPED = '([^\\s>#\\-`\\\\|:=<][^\\n:=<]*?)';
  const KEY_UNESCAPED_INDEX = 19;

  // key:
  // `key`: value
  const KEY_ESCAPE_BEGIN_OPERATOR_INDEX = 20;
  const KEY_ESCAPED = '(`++)[^\\S\\n]*(\\S[^\\n]*?)[^\\S\\n]*(\\'.self::KEY_ESCAPE_BEGIN_OPERATOR_INDEX.')';
  const KEY_ESCAPED_INDEX = 21;
  const KEY_ESCAPE_END_OPERATOR_INDEX = 22;

  const KEY = '(?:'.self::KEY_UNESCAPED.'|'.self::KEY_ESCAPED.')';

  const ELEMENT_OR_FIELD = '(:)[^\\S\\n]*'.self::OPTIONAL;
  const ELEMENT_OPERATOR_INDEX = 23;
  const FIELD_VALUE_INDEX = 24;

  // key =
  // `key` = value
  const FIELDSET_ENTRY = '(=)[^\\S\\n]*'.self::OPTIONAL;
  const FIELDSET_ENTRY_OPERATOR_INDEX = 25;
  const FIELDSET_ENTRY_VALUE_INDEX = 26;

  // key < template
  // `key` < template
  const TEMPLATE = '(<(?!<)|<<)\\s*'.self::REQUIRED;
  const COPY_OPERATOR_INDEX = 27;
  const TEMPLATE_INDEX = 28;

  const LATE_DETERMINED = self::KEY.'\\s*(?:'.self::ELEMENT_OR_FIELD.'|'.self::FIELDSET_ENTRY.'|'.self::TEMPLATE.')';

  const NOT_EMPTY = '(?:'.self::EARLY_DETERMINED.'|'.self::LATE_DETERMINED.')';

  const REGEX = '/[^\\S\\n]*(?:'.self::EMPTY.'|'.self::NOT_EMPTY.')[^\\S\\n]*(?=\\n|$)/';
}
