class MissingField {
  constructor(key, parent) {
    this._key = key;
    this._parent = parent;
  }

  get [Symbol.toStringTag]() {
    return 'MissingField';
  }

  _missingError() {
    this._parent._missingError(this);
  }

  key(_loader) {
    this._parent._missingError(this);
  }

  optionalComment(_loader) {
    return null;
  }

  optionalStringComment() {
    return null;
  }

  optionalStringValue() {
    return null;
  }

  optionalValue(_loader) {
    return null;
  }

  // TODO: I think this I wanted to remove here and elsewhere and re-implement as internal helper for specs?
  raw() {
    return null;
  }

  requiredComment() {
    this._parent._missingError(this);
  }

  requiredStringComment() {
    this._parent._missingError(this);
  }

  requiredStringValue() {
    this._parent._missingError(this);
  }

  requiredValue() {
    this._parent._missingError(this);
  }

  stringKey() {
    this._parent._missingError(this);
  }

  toString() {
    return `[object MissingField key="${this._key}"]`;
  }
}

exports.MissingField = MissingField;
