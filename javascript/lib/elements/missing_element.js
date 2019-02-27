// TODO: Probably we can inherit this in all Missing* implementations?

class MissingElement {
  constructor(key, parent) {
    this._key = key;
    this._parent = parent;
  }

  get [Symbol.toStringTag]() {
    return 'MissingElement';
  }

  _missingError(_element) {
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

  raw() {
    return null;
  }

  requiredComment(_loader) {
    this._parent._missingError(this);
  }

  requiredStringComment() {
    this._parent._missingError(this);
  }

  stringKey() {
    this._parent._missingError(this);
  }

  toString() {
    return `[object MissingElement key="${this._key}"]`;
  }
}

exports.MissingElement = MissingElement;
