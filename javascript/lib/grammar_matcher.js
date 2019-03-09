// Note: Study this file from the bottom up

const OPTIONAL = '([^\\n]+?)?';
const REQUIRED = '(\\S[^\\n]*?)';

//
const EMPTY = '()';
exports.EMPTY_LINE_INDEX = 1;

// | [value]
const DIRECT_LINE_CONTINUATION = `(\\|)[^\\S\\n]*${OPTIONAL}`;
exports.DIRECT_LINE_CONTINUATION_OPERATOR_INDEX = 2;
exports.DIRECT_LINE_CONTINUATION_VALUE_INDEX = 3;

// \ [value]
const SPACED_LINE_CONTINUATION = `(\\\\)[^\\S\\n]*${OPTIONAL}`;
exports.SPACED_LINE_CONTINUATION_OPERATOR_INDEX = 4;
exports.SPACED_LINE_CONTINUATION_VALUE_INDEX = 5;

const CONTINUATION = `${DIRECT_LINE_CONTINUATION}|${SPACED_LINE_CONTINUATION}`;

// > Comment
const COMMENT = `(>)[^\\S\\n]*${OPTIONAL}`;
exports.COMMENT_OPERATOR_INDEX = 6;
exports.COMMENT_INDEX = 7;

// - [value]
const LIST_ITEM = `(-)(?!-)[^\\S\\n]*${OPTIONAL}`;
exports.LIST_ITEM_OPERATOR_INDEX = 8;
exports.LIST_ITEM_VALUE_INDEX = 9;

// -- [key]
const MULTILINE_FIELD = `(-{2,})(?!-)[^\\S\\n]*${REQUIRED}`;
exports.MULTILINE_FIELD_OPERATOR_INDEX = 10;
exports.MULTILINE_FIELD_KEY_INDEX = 11;

// #
const SECTION_OPERATOR = '(#+)(?!#)';
exports.SECTION_OPERATOR_INDEX = 12;

// # [key]
const SECTION_KEY_UNESCAPED = '([^`\\s<][^<\\n]*?)';
exports.SECTION_KEY_UNESCAPED_INDEX = 13;

// # `[key]`
const SECTION_KEY_ESCAPE_BEGIN_OPERATOR_INDEX = 14
const SECTION_KEY_ESCAPED = `(\`+)(?!\`)[^\\S\\n]*(\\S[^\\n]*?)[^\\S\\n]*\\${SECTION_KEY_ESCAPE_BEGIN_OPERATOR_INDEX}`; // TODO: Should this exclude the backreference inside the quotes? (as in ((?:(?!\\1).)+) ) here and elsewhere (probably not because it's not greedy.?)
exports.SECTION_KEY_ESCAPE_BEGIN_OPERATOR_INDEX = SECTION_KEY_ESCAPE_BEGIN_OPERATOR_INDEX;
exports.SECTION_KEY_ESCAPED_INDEX = 15;

// # [key] <(<) [template]
// # `[key]` <(<) [template]
const SECTION_KEY = `(?:${SECTION_KEY_UNESCAPED}|${SECTION_KEY_ESCAPED})`;
const SECTION_TEMPLATE = `(?:(<(?!<)|<<)[^\\S\\n]*${REQUIRED})?`;
const SECTION = `${SECTION_OPERATOR}\\s*${SECTION_KEY}[^\\S\\n]*${SECTION_TEMPLATE}`;
exports.SECTION_COPY_OPERATOR_INDEX = 16;
exports.SECTION_TEMPLATE_INDEX = 17;

const EARLY_DETERMINED = `${CONTINUATION}|${COMMENT}|${LIST_ITEM}|${MULTILINE_FIELD}|${SECTION}`;

// [key]
const KEY_UNESCAPED = '([^\\s>#\\-`\\\\|:=<][^:=<\\n]*?)';
exports.KEY_UNESCAPED_INDEX = 18;

// `[key]`
const KEY_ESCAPE_BEGIN_OPERATOR_INDEX = 19
const KEY_ESCAPED = `(\`+)(?!\`)[^\\S\\n]*(\\S[^\\n]*?)[^\\S\\n]*\\${KEY_ESCAPE_BEGIN_OPERATOR_INDEX}`;
exports.KEY_ESCAPE_BEGIN_OPERATOR_INDEX = KEY_ESCAPE_BEGIN_OPERATOR_INDEX;
exports.KEY_ESCAPED_INDEX = 20;

const KEY = `(?:${KEY_UNESCAPED}|${KEY_ESCAPED})`;

// :
// : [value]
const ELEMENT_OR_FIELD = `(:)[^\\S\\n]*${OPTIONAL}`;
exports.ELEMENT_OPERATOR_INDEX = 21;
exports.FIELD_VALUE_INDEX = 22;

// =
// = [value]
const FIELDSET_ENTRY = `(=)[^\\S\\n]*${OPTIONAL}`;
exports.FIELDSET_ENTRY_OPERATOR_INDEX = 23;
exports.FIELDSET_ENTRY_VALUE_INDEX = 24;

// <(<) [template]
const TEMPLATE = `(<(?!<)|<<)\\s*${REQUIRED}`;
exports.COPY_OPERATOR_INDEX = 25;
exports.TEMPLATE_INDEX = 26;

const LATE_DETERMINED = `${KEY}\\s*(?:${ELEMENT_OR_FIELD}|${FIELDSET_ENTRY}|${TEMPLATE})`;

const NOT_EMPTY = `(?:${EARLY_DETERMINED}|${LATE_DETERMINED})`;

exports.GRAMMAR_REGEXP = new RegExp(`[^\\S\\n]*(?:${EMPTY}|${NOT_EMPTY})[^\\S\\n]*(?=\\n|$)`, 'y');
