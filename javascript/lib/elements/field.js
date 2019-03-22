const section_module = require('./section.js');

const { errors } = require('../errors/validation.js');
const { ValueElementBase } = require('./value_element_base.js');

class Field extends ValueElementBase {
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

  /**
   * Returns the value of this {@link Field} as a `string` and touches the element.
   * Returns `null` if there is no value.
   *
   * @return {?string} The value of this {@link Field} as a `string`, or `null`.
   */
  optionalStringValue() {
    return this._value(null, false);
  }

  /**
   * Passes the value of this {@link Field} through the provided loader, returns the result and touches the element.
   * The loader is only invoked if there is a value, otherwise `null` is returned directly.
   * Throws a {@link ValidationError} if an error is intercepted from the loader.
   *
   * @example
   * // Given a field containing the value 'foo' ...
   *
   * field.optionalValue(value => value.toUpperCase()); // returns 'FOO'
   * field.optionalValue(value => { throw 'You shall not pass!'; }); // throws an error based on the intercepted error message
   *
   * // Given a field containing no value ...
   *
   * field.optionalValue(value => value.toUpperCase()); // returns null
   * field.optionalValue(value => { throw 'You shall not pass!'; }); // returns null
   *
   * @param {function(value: string): any} loader A loader function taking a `string` value and returning any other type or throwing a `string` message.
   * @return {?any} The result of applying the provided loader to this {@link Field}'s value, or `null` when empty.
   * @throws {ValidationError} Thrown when an error from the loader is intercepted.
   */
  optionalValue(loader) {
    return this._value(loader, false);
  }

  /**
   * Returns the parent instance, either a {@link Fieldset}, {@link List} or {@link Section}.
   *
   * @return {Fieldset|List|Section} The parent element instance.
   */
  parent() {
    return this._parent || new section_module.Section(this._context, this._instruction.parent);
  }

  /**
   * Returns the value of this {@link Field} as a `string` and touches the element.
   * Throws a {@link ValidationError} if there is no value.
   *
   * @return {string} The value of this {@link Field} as a `string`.
   * @throws {ValidationError} Thrown when there is no value.
   */
  requiredStringValue() {
    return this._value(null, true);
  }

  /**
   * Passes the value of this {@link Field} through the provided loader, returns the result and touches the element.
   * The loader is only invoked if there is a value, otherwise a {@link ValidationError} is thrown directly.
   * Also throws a {@link ValidationError} if an error is intercepted from the loader.
   *
   * @example
   * // Given a field containing the value 'foo' ...
   *
   * field.requiredValue(value => value.toUpperCase()); // returns 'FOO'
   * field.requiredValue(value => { throw 'You shall not pass!'; }); // throws an error based on the intercepted error message
   *
   * // Given a field containing no value ...
   *
   * field.requiredValue(value => value.toUpperCase()); // throws an error stating that a required value is missing
   * field.requiredValue(value => { throw 'You shall not pass!'; }); // throws an error stating that a required value is missing
   *
   * @param {function(value: string): any} loader A loader function taking a `string` value and returning any other type or throwing a `string` message.
   * @return {any} The result of applying the provided loader to this {@link Field}'s value.
   * @throws {ValidationError} Thrown when there is no value or an error from the loader is intercepted.
   */
  requiredValue(loader) {
    return this._value(loader, true);
  }

  /**
   * Returns a debug representation of this {@link Field} in the form of `[object Field key=foo value=bar]`.
   *
   * @return {string} A debug representation of this {@link Field}.
   */
  toString() {
    return `[object Field key=${this._instruction.key} value=${this._printValue()}]`;
  }
}

exports.Field = Field;
