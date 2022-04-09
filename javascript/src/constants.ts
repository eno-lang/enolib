// Added to 0-indexed indices in a few places
export const HUMAN_INDEXING = 1;

// Selection indices
export const BEGIN = 0;
export const END = 1;

// Instruction types
export const ATTRIBUTE = Symbol('Attribute');
export const COMMENT = Symbol('Comment');
export const CONTINUATION = Symbol('Continuation');
export const DOCUMENT = Symbol('Document');
export const FLAG = Symbol('Flag');
export const FIELD = Symbol('Field');
export const ITEM = Symbol('Item');
export const EMBED_BEGIN = Symbol('Embed Begin');
export const EMBED_END = Symbol('Embed End');
export const EMBED_VALUE = Symbol('Embed Value');
export const SECTION = Symbol('Section');
export const UNPARSED = Symbol('Unparsed');

// Maps instruction type symbols to printable strings
export const PRETTY_TYPES = {
    [ATTRIBUTE]: 'attribute',
    [DOCUMENT]: 'document',
    [FLAG]: 'flag',
    [FIELD]: 'field',
    [ITEM]: 'item',
    [EMBED_BEGIN]: 'field',
    [SECTION]: 'section'
};
