const { MissingValueElementBase } = require('./missing_value_element_base.js');

class MissingFieldsetEntry extends MissingValueElementBase {
  get [Symbol.toStringTag]() {
    return 'MissingFieldsetEntry';
  }

  toString() {
    return `[object MissingFieldsetEntry key="${this._key}"]`;
  }
}

exports.MissingFieldsetEntry = MissingFieldsetEntry;
