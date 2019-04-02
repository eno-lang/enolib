const missing_fieldset_entry_module = require('./missing_fieldset_entry.js');

const { MissingElementBase } = require('./missing_element_base.js');

class MissingFieldset extends MissingElementBase {
  get [Symbol.toStringTag]() {
    return 'MissingFieldset';
  }

  entries(_key = null) {
    return [];
  }

  entry(key = null) {
    return new missing_fieldset_entry_module.MissingFieldsetEntry(key, this);
  }

  optionalEntry(_key = null) {
    return null;
  }

  requiredEntry(_key = null) {
    this._parent._missingError(this);
  }

  toString() {
    if(this._key === null)
      return `[object MissingFieldset]`;

    return `[object MissingFieldset key=${this._key}]`;
  }
}

exports.MissingFieldset = MissingFieldset;
