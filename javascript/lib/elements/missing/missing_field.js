const { MissingValueElementBase } = require('./missing_value_element_base.js');

class MissingField extends MissingValueElementBase {
  get [Symbol.toStringTag]() {
    return 'MissingField';
  }

  toString() {
    if(this._key === null)
      return `[object MissingField]`;

    return `[object MissingField key=${this._key}]`;
  }
}

exports.MissingField = MissingField;
