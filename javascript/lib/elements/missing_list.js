class MissingList {
  constructor(key, parent) {
    this._key = key;
    this._parent = parent;
  }

  get [Symbol.toStringTag]() {
    return 'MissingList';
  }

  _missingError(_element) {
    this._parent._missingError(this);
  }

  items() {
    return [];
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

  optionalStringValues() {
    return [];
  }

  optionalValues(_loader) {
    return [];
  }

  raw() {
    return null;
  }

  requiredComment(_loader) {
    this._parent._missingError(this);
  }

  requiredStringComment() {
    this._parent._missingError(this);
  }

  // Heads up: 'required' refers to the values of the items, not the items
  requiredStringValues() {
    return [];
  }

  // Heads up: 'required' refers to the values of the items, not the items
  requiredValues(_loader) {
    return [];
  }

  stringKey() {
    this._parent._missingError(this);
  }

  toString() {
    return `[object MissingList key="${this._key}"]`;
  }
}

exports.MissingList = MissingList;
