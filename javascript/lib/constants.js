// Added to 0-indexed indices in a few places
exports.HUMAN_INDEXING = 1;

// Selection indices
exports.BEGIN = 0;
exports.END = 1;

// Instruction types
exports.COMMENT = Symbol('Comment');
exports.CONTINUATION = Symbol('Continuation');
exports.DOCUMENT = Symbol('Document');
exports.EMPTY = Symbol('Empty');
exports.FIELD = Symbol('Field');
exports.FIELDSET = Symbol('Fieldset');
exports.FIELDSET_ENTRY = Symbol('Fieldset Entry');
exports.FIELD_OR_FIELDSET_OR_LIST = Symbol('Field, Fieldset or List');
exports.LIST = Symbol('List');
exports.LIST_ITEM = Symbol('List Item');
exports.MULTILINE_FIELD_BEGIN = Symbol('Multiline Field Begin');
exports.MULTILINE_FIELD_END = Symbol('Multiline Field End');
exports.MULTILINE_FIELD_VALUE = Symbol('Multiline Field Value');
exports.SECTION = Symbol('Section');
exports.UNPARSED = Symbol('Unparsed');

// Maps instruction type symbols to printable strings
exports.PRETTY_TYPES = {
  [exports.DOCUMENT]: 'document',
  [exports.EMPTY]: 'empty',
  [exports.FIELD]: 'field',
  [exports.FIELDSET]: 'fieldset',
  [exports.FIELDSET_ENTRY]: 'fieldsetEntry',
  [exports.FIELD_OR_FIELDSET_OR_LIST]: 'fieldOrFieldsetOrList',
  [exports.LIST]: 'list',
  [exports.LIST_ITEM]: 'listItem',
  [exports.MULTILINE_FIELD_BEGIN]: 'field',
  [exports.SECTION]: 'section'
};
