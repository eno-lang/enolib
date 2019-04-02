const { MissingElementBase } = require('./missing_element_base.js');

class MissingEmpty extends MissingElementBase {
  get [Symbol.toStringTag]() {
    return 'MissingEmpty';
  }

  toString() {
    if(this._key === null)
      return `[object MissingEmpty]`;

    return `[object MissingEmpty key=${this._key}]`;
  }
}

exports.MissingEmpty = MissingEmpty;
