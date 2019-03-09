const { MissingElement } = require('./missing_element.js');

class MissingEmpty extends MissingElement {
  get [Symbol.toStringTag]() {
    return 'MissingEmpty';
  }

  toString() {
    return `[object MissingEmpty key="${this._key}"]`; // TODO: Here and elsewhere adaptations for missing elements with null key (if/else display variants)
  }
}

exports.MissingEmpty = MissingEmpty;
