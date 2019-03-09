const { MissingValueElement } = require('./missing_value_element.js');

class MissingFieldsetEntry extends MissingValueElement {
  get [Symbol.toStringTag]() {
    return 'MissingFieldsetEntry';
  }

  toString() {
    return `[object MissingFieldsetEntry key="${this._key}"]`;
  }
}

exports.MissingFieldsetEntry = MissingFieldsetEntry;
