const { errors } = require('../errors/validation.js');
const section_module = require('./section.js');
const { ValueElement } = require('./value_element.js');

class Field extends ValueElement {
  get [Symbol.toStringTag]() {
    return 'Field';
  }

  _value(loader, required) {
    this._touched = true;

    const value = this._context.value(this._instruction);

    if(value === null) {
      if(required)
        throw errors.missingValue(this._context, this._instruction);

      return null;
    }

    if(!loader)
      return value;

    try {
      return loader(value);
    } catch(message) {
      throw errors.valueError(this._context, message, this._instruction);
    }
  }

  optionalStringValue() {
    return this._value(null, false);
  }

  optionalValue(loader) {
    return this._value(loader, false);
  }

  parent() {
    return this._parent || new section_module.Section(this._context, this._instruction.parent);
  }

  requiredStringValue() {
    return this._value(null, true);
  }

  requiredValue(loader) {
    return this._value(loader, true);
  }

  toString() {
    return `[object Field key=${this._instruction.key} value=${this._printValue()}]`;
  }

  valueError(message) {
    return errors.valueError(
      this._context,
      typeof message === 'function' ? message(this._context.value(this._instruction)) : message,
      this._instruction
    );
  }
}

exports.Field = Field;
