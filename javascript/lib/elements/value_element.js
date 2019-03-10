const { Element } = require('./element.js');
const { errors } = require('../errors/validation.js');

class ValueElement extends Element {
  _printValue() {
    let value = this._context.value(this._instruction);

    if(value === null) {
      value = 'null';
    } else {
      value = value.replace('\n', '\\n');
      if(value.length > 14) {
        value = value.substr(0, 11) + '...';
      }
      value = `"${value}"`;
    }

    return value;
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

  requiredStringValue() {
    return this._value(null, true);
  }

  requiredValue(loader) {
    return this._value(loader, true);
  }

  valueError(message) {
    return errors.valueError(
      this._context,
      typeof message === 'function' ? message(this._context.value(this._instruction)) : message,
      this._instruction
    );
  }
}

exports.ValueElement = ValueElement;
