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
const ITEM = `(-)(?!-)[^\\S\\n]*${OPTIONAL}`;
exports.ITEM_OPERATOR_INDEX = 8;
exports.ITEM_VALUE_INDEX = 9;

// -- key
const MULTILINE_FIELD = `(-{2,})(?!-)[^\\S\\n]*${REQUIRED}`;
exports.MULTILINE_FIELD_OPERATOR_INDEX = 10;
exports.MULTILINE_FIELD_KEY_INDEX = 11;

// # key
const SECTION = `(#+)(?!#)[^\\S\\n]*${REQUIRED}`;
exports.SECTION_OPERATOR_INDEX = 12;
exports.SECTION_KEY_INDEX = 13;

const EARLY_DETERMINED = `${CONTINUATION}|${COMMENT}|${ITEM}|${MULTILINE_FIELD}|${SECTION}`;

// key
const KEY_UNESCAPED = '([^\\s>#\\-`\\\\|:=][^:=\\n]*?)';
exports.KEY_UNESCAPED_INDEX = 14;

// `key`
const KEY_ESCAPE_BEGIN_OPERATOR_INDEX = 15;
const KEY_ESCAPED = `(\`+)(?!\`)[^\\S\\n]*(\\S[^\\n]*?)[^\\S\\n]*\\${KEY_ESCAPE_BEGIN_OPERATOR_INDEX}`;
exports.KEY_ESCAPE_BEGIN_OPERATOR_INDEX = KEY_ESCAPE_BEGIN_OPERATOR_INDEX;
exports.KEY_ESCAPED_INDEX = 16;

const KEY = `(?:${KEY_UNESCAPED}|${KEY_ESCAPED})`;

// :
// : value
const FIELD = `(:)[^\\S\\n]*${OPTIONAL}`;
exports.FIELD_OPERATOR_INDEX = 17;
exports.FIELD_VALUE_INDEX = 18;

// =
// = value
const ATTRIBUTE = `(=)[^\\S\\n]*${OPTIONAL}`;
exports.ATTRIBUTE_OPERATOR_INDEX = 19;
exports.ATTRIBUTE_VALUE_INDEX = 20;

const LATE_DETERMINED = `${KEY}\\s*(?:${FIELD}|${ATTRIBUTE})?`;

const NON_EMPTY_LINE = `(?:${EARLY_DETERMINED}|${LATE_DETERMINED})`;

exports.GRAMMAR_REGEXP = new RegExp(`[^\\S\\n]*(?:${EMPTY_LINE}|${NON_EMPTY_LINE})[^\\S\\n]*(?=\\n|$)`, 'y');
