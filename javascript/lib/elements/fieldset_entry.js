const { errors } = require('../errors/validation.js');
const fieldset_module = require('./fieldset.js');
const { ValueElement } = require('./value_element.js');

class FieldsetEntry extends ValueElement {
  constructor(context, instruction) {
    super(context, instruction);

    this._instruction.instance = this;
  }

  get [Symbol.toStringTag]() {
    return 'FieldsetEntry';
  }

  parent() {
    return this._instruction.parent.instance ||
           new fieldset_module.Fieldset(this._context, this._instruction.parent);
  }

  toString() {
    return `[object FieldsetEntry key=${this._instruction.key} value=${this._printValue()}]`;
  }
}

exports.FieldsetEntry = FieldsetEntry;
