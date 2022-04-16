// Study this file from the bottom up

const OPTIONAL = '([^\\n]+?)?';
const REQUIRED = '(\\S[^\\n]*?)';

//
const EMPTY_LINE = '()';
export const EMPTY_LINE_INDEX = 1;

// | value
// \ value
const CONTINUATION = `([|\\\\])[^\\S\\n]*${OPTIONAL}`;
export const CONTINUATION_OPERATOR_INDEX = 2;
export const CONTINUATION_VALUE_INDEX = 3;

// > comment
const COMMENT = `(>)[^\\S\\n]*${OPTIONAL}`;
export const COMMENT_OPERATOR_INDEX = 4;
export const COMMENT_INDEX = 5;

// - value
const ITEM = `(-)(?!-)[^\\S\\n]*${OPTIONAL}`;
export const ITEM_OPERATOR_INDEX = 6;
export const ITEM_VALUE_INDEX = 7;

// -- key
const EMBED = `(-{2,})(?!-)[^\\S\\n]*${REQUIRED}`;
export const EMBED_OPERATOR_INDEX = 8;
export const EMBED_KEY_INDEX = 9;

// # key
const SECTION = `(#+)(?!#)[^\\S\\n]*${REQUIRED}`;
export const SECTION_OPERATOR_INDEX = 10;
export const SECTION_KEY_INDEX = 11;

const EARLY_DETERMINED = `${CONTINUATION}|${COMMENT}|${ITEM}|${EMBED}|${SECTION}`;

// key
const KEY_UNESCAPED = '([^\\s>#\\-`\\\\|:=][^:=\\n]*?)';
export const KEY_UNESCAPED_INDEX = 12;

// `key`
export const KEY_ESCAPE_BEGIN_OPERATOR_INDEX = 13;
const KEY_ESCAPED = `(\`+)(?!\`)[^\\S\\n]*(\\S[^\\n]*?)[^\\S\\n]*\\${KEY_ESCAPE_BEGIN_OPERATOR_INDEX}`;
export const KEY_ESCAPED_INDEX = 14;

const KEY = `(?:${KEY_UNESCAPED}|${KEY_ESCAPED})`;

// :
// : value
const FIELD = `(:)[^\\S\\n]*${OPTIONAL}`;
export const FIELD_OPERATOR_INDEX = 15;
export const FIELD_VALUE_INDEX = 16;

// =
// = value
const ATTRIBUTE = `(=)[^\\S\\n]*${OPTIONAL}`;
export const ATTRIBUTE_OPERATOR_INDEX = 17;
export const ATTRIBUTE_VALUE_INDEX = 18;

const LATE_DETERMINED = `${KEY}\\s*(?:${FIELD}|${ATTRIBUTE})?`;

const NON_EMPTY_LINE = `(?:${EARLY_DETERMINED}|${LATE_DETERMINED})`;

export const GRAMMAR_REGEXP = new RegExp(`[^\\S\\n]*(?:${EMPTY_LINE}|${NON_EMPTY_LINE})[^\\S\\n]*(?=\\n|$)`, 'y');
