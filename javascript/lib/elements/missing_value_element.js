const { MissingElement } = require('./missing_element.js');

class MissingValueElement extends MissingElement {
  optionalStringValue() {
    return null;
  }

  optionalValue(_loader) {
    return null;
  }

  requiredStringValue() {
    this._parent._missingError(this);
  }

  requiredValue() {
    this._parent._missingError(this);
  }
}

exports.MissingValueElement = MissingValueElement;
