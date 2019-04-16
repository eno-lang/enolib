const { ElementBase } = require('./element_base.js');
const { errors } = require('../errors/validation.js');

class ValueElementBase extends ElementBase {
  _printValue() {
    let value = this._context.value(this._instruction);

    if(value === null) return 'null';

    if(value.length > 14) {
      value = value.substring(0, 11) + '...';
    }

    return value.replace('\n', '\\n');
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

  /**
   * Constructs and returns a {@link ValidationError} with the supplied message in the context of this element's value.
   *
   * Note that this only *returns* an error, whether you want to just use its
   * metadata, pass it on or actually throw the error is up to you.
   *
   * @param {string|function(value: string): string} message A message or a function that receives the element's value and returns the message.
   * @return {ValidationError} The requested error.
   */
  valueError(message) {
    return errors.valueError(
      this._context,
      typeof message === 'function' ? message(this._context.value(this._instruction)) : message,
      this._instruction
    );
  }
}

exports.ValueElementBase = ValueElementBase;
