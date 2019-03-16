const { MissingElementBase } = require('./missing_element_base.js');

class MissingValueElementBase extends MissingElementBase {
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

exports.MissingValueElementBase = MissingValueElementBase;
