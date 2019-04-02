const { MissingValueElementBase } = require('./missing_value_element_base.js');

class MissingFieldsetEntry extends MissingValueElementBase {
  get [Symbol.toStringTag]() {
    return 'MissingFieldsetEntry';
  }

  toString() {
    if(this._key === null)
      return `[object MissingFieldsetEntry]`;

    return `[object MissingFieldsetEntry key=${this._key}]`;
  }
}

exports.MissingFieldsetEntry = MissingFieldsetEntry;
