// Added to 0-indexed indices in a few places
export const HUMAN_INDEXING = 1;

// More semantic access to ranges
export const RANGE_BEGIN = 0;
export const RANGE_END = 1;

export const ID_CONTAINS_ATTRIBUTES = 0x1;
export const ID_CONTAINS_CONTINUATIONS = 0x2;
export const ID_CONTAINS_ITEMS = 0x4;
export const ID_CONTAINS_VALUE = 0x8; // refers to a value inside a continuation or directly on the instruction
export const ID_TYPE_ATTRIBUTE = 0x10;
export const ID_TYPE_COMMENT = 0x20;
export const ID_TYPE_CONTINUATION = 0x40;
export const ID_TYPE_DOCUMENT = 0x80;
export const ID_TYPE_EMBED = 0x100;
export const ID_TYPE_EMBED_TERMINATOR = 0x200;
export const ID_TYPE_EMBED_VALUE = 0x400;
export const ID_TYPE_FIELD = 0x800;
export const ID_TYPE_FLAG = 0x1000;
export const ID_TYPE_ITEM = 0x2000;
export const ID_TYPE_SECTION = 0x4000;
export const ID_TYPE_UNPARSED = 0x8000;