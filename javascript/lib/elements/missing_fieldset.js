const { MissingElement } = require('./missing_element.js');
const missing_fieldset_entry_module = require('./missing_fieldset_entry.js');

class MissingFieldset extends MissingElement {
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
    return `[object MissingFieldset key="${this._key}"]`;
  }
}

exports.MissingFieldset = MissingFieldset;
