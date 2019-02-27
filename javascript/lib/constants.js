// Added to 0-indexed indices in a few places
exports.HUMAN_INDEXING = 1;

// Selection indices
exports.BEGIN = 0;
exports.END = 1;

// Instruction types
exports.COMMENT = Symbol('Comment');
exports.CONTINUATION = Symbol('Continuation');
exports.ELEMENT = Symbol('Element');
exports.FIELD = Symbol('Field');
exports.FIELDSET = Symbol('Fieldset');
exports.FIELDSET_ENTRY = Symbol('Fieldset Entry');
exports.LIST = Symbol('List');
exports.LIST_ITEM = Symbol('List Item');
exports.MULTILINE_FIELD_BEGIN = Symbol('Multiline Field Begin');
exports.MULTILINE_FIELD_END = Symbol('Multiline Field End');
exports.MULTILINE_FIELD_VALUE = Symbol('Multiline Field Value');
exports.SECTION = Symbol('Section');
