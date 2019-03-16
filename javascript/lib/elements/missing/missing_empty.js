const { MissingElementBase } = require('./missing_element_base.js');

class MissingEmpty extends MissingElementBase {
  get [Symbol.toStringTag]() {
    return 'MissingEmpty';
  }

  toString() {
    return `[object MissingEmpty key="${this._key}"]`; // TODO: Here and elsewhere adaptations for missing elements with null key (if/else display variants)
  }
}

exports.MissingEmpty = MissingEmpty;
