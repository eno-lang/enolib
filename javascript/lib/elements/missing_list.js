const { MissingElement } = require('./missing_element.js');

class MissingList extends MissingElement {
  get [Symbol.toStringTag]() {
    return 'MissingList';
  }

  items() {
    return [];
  }

  optionalStringValues() {
    return [];
  }

  optionalValues(_loader) {
    return [];
  }

  requiredStringValues() {
    return [];
  }

  requiredValues(_loader) {
    return [];
  }

  toString() {
    return `[object MissingList key="${this._key}"]`;
  }
}

exports.MissingList = MissingList;
