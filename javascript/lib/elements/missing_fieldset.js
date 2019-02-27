const missing_field_module = require('./missing_field.js');

class MissingFieldset {
  constructor(key, parent) {
    this._key = key;
    this._parent = parent;
  }

  get [Symbol.toStringTag]() {
    return 'MissingFieldset';
  }

  _missingError(_element) {
    this._parent._missingError(this);
  }

  entries() {
    return [];
  }

  entry(key) {
    return new missing_field_module.MissingField(key, this);
  }

  key(_loader) {
    this._parent._missingError(this);
  }

  optionalComment(_loader) {
    return null;
  }

  optionalEntry(_key) {
    return null;
  }

  optionalStringComment() {
    return null;
  }

  raw() {
    return null;
  }

  requiredComment(_loader) {
    this._parent._missingError(this);
  }

  requiredEntry(_key) {
    this._parent._missingError(this);
  }

  requiredStringComment() {
    this._parent._missingError(this);
  }

  stringKey() {
    this._parent._missingError(this);
  }

  toString() {
    return `[object MissingFieldset key="${this._key}"]`;
  }
}

exports.MissingFieldset = MissingFieldset;
