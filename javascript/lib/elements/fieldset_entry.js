const fieldset_module = require('./fieldset.js');

const { ValueElementBase } = require('./value_element_base.js');

class FieldsetEntry extends ValueElementBase {
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
