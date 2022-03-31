// Note: Study this file from the bottom up

const OPTIONAL = '([^\\n]+?)?';
const REQUIRED = '(\\S[^\\n]*?)';

//
const EMPTY_LINE = '()';
exports.EMPTY_LINE_INDEX = 1;

// | value
const DIRECT_LINE_CONTINUATION = `(\\|)[^\\S\\n]*${OPTIONAL}`;
exports.DIRECT_LINE_CONTINUATION_OPERATOR_INDEX = 2;
exports.DIRECT_LINE_CONTINUATION_VALUE_INDEX = 3;

// \ value
const SPACED_LINE_CONTINUATION = `(\\\\)[^\\S\\n]*${OPTIONAL}`;
exports.SPACED_LINE_CONTINUATION_OPERATOR_INDEX = 4;
exports.SPACED_LINE_CONTINUATION_VALUE_INDEX = 5;

const CONTINUATION = `${DIRECT_LINE_CONTINUATION}|${SPACED_LINE_CONTINUATION}`;

// > comment
const COMMENT = `(>)[^\\S\\n]*${OPTIONAL}`;
exports.COMMENT_OPERATOR_INDEX = 6;
exports.COMMENT_INDEX = 7;

// - value
const LIST_ITEM = `(-)(?!-)[^\\S\\n]*${OPTIONAL}`;
exports.LIST_ITEM_OPERATOR_INDEX = 8;
exports.LIST_ITEM_VALUE_INDEX = 9;

// -- key
const MULTILINE_FIELD = `(-{2,})(?!-)[^\\S\\n]*${REQUIRED}`;
exports.MULTILINE_FIELD_OPERATOR_INDEX = 10;
exports.MULTILINE_FIELD_KEY_INDEX = 11;

// # key
const SECTION = `(#+)(?!#)[^\\S\\n]*${REQUIRED}`;
exports.SECTION_OPERATOR_INDEX = 12;
exports.SECTION_KEY_INDEX = 13;

const EARLY_DETERMINED = `${CONTINUATION}|${COMMENT}|${LIST_ITEM}|${MULTILINE_FIELD}|${SECTION}`;

// key
const KEY_UNESCAPED = '([^\\s>#\\-`\\\\|:=<][^:=<\\n]*?)';
exports.KEY_UNESCAPED_INDEX = 14;

// `key`
const KEY_ESCAPE_BEGIN_OPERATOR_INDEX = 15;
const KEY_ESCAPED = `(\`+)(?!\`)[^\\S\\n]*(\\S[^\\n]*?)[^\\S\\n]*\\${KEY_ESCAPE_BEGIN_OPERATOR_INDEX}`;
exports.KEY_ESCAPE_BEGIN_OPERATOR_INDEX = KEY_ESCAPE_BEGIN_OPERATOR_INDEX;
exports.KEY_ESCAPED_INDEX = 16;

const KEY = `(?:${KEY_UNESCAPED}|${KEY_ESCAPED})`;

// :
// : value
const FIELD_OR_FIELDSET_OR_LIST = `(:)[^\\S\\n]*${OPTIONAL}`;
exports.ELEMENT_OPERATOR_INDEX = 17;
exports.FIELD_VALUE_INDEX = 18;

// =
// = value
const FIELDSET_ENTRY = `(=)[^\\S\\n]*${OPTIONAL}`;
exports.FIELDSET_ENTRY_OPERATOR_INDEX = 19;
exports.FIELDSET_ENTRY_VALUE_INDEX = 20;

const LATE_DETERMINED = `${KEY}\\s*(?:${FIELD_OR_FIELDSET_OR_LIST}|${FIELDSET_ENTRY})?`;

const NON_EMPTY_LINE = `(?:${EARLY_DETERMINED}|${LATE_DETERMINED})`;

exports.GRAMMAR_REGEXP = new RegExp(`[^\\S\\n]*(?:${EMPTY_LINE}|${NON_EMPTY_LINE})[^\\S\\n]*(?=\\n|$)`, 'y');
