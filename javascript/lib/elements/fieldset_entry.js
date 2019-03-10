const fieldset_module = require('./fieldset.js');
const { ValueElement } = require('./value_element.js');

class FieldsetEntry extends ValueElement {
  get [Symbol.toStringTag]() {
    return 'FieldsetEntry';
  }

  parent() {
    return this._parent || new fieldset_module.Fieldset(this._context, this._instruction.parent);
  }

  toString() {
    return `[object FieldsetEntry key=${this._instruction.key} value=${this._printValue()}]`;
  }
}

exports.FieldsetEntry = FieldsetEntry;
