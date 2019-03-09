const { MissingValueElement } = require('./missing_value_element.js');

class MissingField extends MissingValueElement {
  get [Symbol.toStringTag]() {
    return 'MissingField';
  }

  toString() {
    return `[object MissingField key="${this._key}"]`;
  }
}

exports.MissingField = MissingField;
