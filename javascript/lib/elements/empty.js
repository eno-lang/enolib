const { Element } = require('./element.js');
const field_module = require('./field.js');
const fieldset_module = require('./fieldset.js');
const list_module = require('./list.js');
const { errors } = require('../errors/validation.js');

const {
  ELEMENT,
  FIELD,
  FIELDSET,
  LIST
} = require('../constants.js');

class Empty extends Element {
  constructor(context, instruction) {
    super(context, instruction);

    this._instruction.instance = this;
  }

  get [Symbol.toStringTag]() {
    return 'Empty';
  }

  _untouched() {  // TODO: Revisit the role of this in new arch - actually there is no tie to empty so this never gets called, but probably should.
    if(this._touched)
      return false;

    if(this.hasOwnProperty('_typecast')) {
      if(this._typecast._touched)
        return false;

      return this._typecast;
    }

    return !this._touched;
  }

  key(loader) {
    this._touched = true;

    try {
      return loader(this._instruction.key);
    } catch(message) {
      throw errors.keyError(this._context, message, this._instruction);
    }
  }

  keyError(message) {
    return errors.keyError(
      this._context,
      typeof message === 'function' ? message(this._instruction.key) : message,
      this._instruction
    );
  }

  parent() {
    return this._instruction.parent.instance || new Section(this._context, this._instruction.parent);
  }

  raw() {
    return { [this._instruction.key]: null };
  }


  stringKey() {
    this._touched = true;

    return this._instruction.key;
  }

  toField() {
    if(this._instruction.type === ELEMENT) {
      new field_module.Field(this._context, this._instruction);
    } else if(this._instruction.type !== FIELD) {
      throw new Error(`The empty element ${this._instruction.key} has already been queried as a Fieldset or List, querying it as Field is not allowed anymore.`);
    }

    return this._instruction.instance;
  }

  toFieldset() {
    if(this._instruction.type === ELEMENT) {
      new fieldset_module.Fieldset(this._context, this._instruction);
    } else if(this._instruction.type !== FIELDSET) {
      throw new Error(`The empty element ${this._instruction.key} has already been queried as a Field or List, querying it as Fieldset is not allowed anymore.`);
    }

    return this._instruction.instance;
  }

  toList() {
    if(this._instruction.type === ELEMENT) {
      new list_module.List(this._context, this._instruction);
    } else if(this._instruction.type !== LIST) {
      throw new Error(`The empty element ${this._instruction.key} has already been queried as a Field or Fieldset, querying it as List is not allowed anymore.`);
    }

    return this._instruction.instance;
  }

  toString() {
    return `[object Empty key=${this._instruction.key}]`;
  }

  touch() {
    this._touched = true;

    if(this._instruction.instance !== this) {
      this._instruction.instance.touch();
    }
  }
}

exports.Empty = Empty;
