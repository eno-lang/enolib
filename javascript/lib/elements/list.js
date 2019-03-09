const { Element } = require('./element.js');
const field_module = require('./field.js');
const { errors } = require('../errors/validation.js');

const { EMPTY_ELEMENT, LIST } = require('../constants.js');

class List extends Element {
  constructor(context, instruction) {
    super(context, instruction);

    // Late determination by the application
    if(this._instruction.type === EMPTY_ELEMENT) {
      this._instruction.items = [];
      this._instruction.type = LIST;

      // Inherit _touched from possible Empty instance
      if(this._instruction.hasOwnProperty('instance')) {
        this._touched = this._instruction.instance._touched;
      }
    }

    this._instruction.instance = this;
  }

  get [Symbol.toStringTag]() {
    return 'List';
  }

  _lazyItems() {
    if(this._instruction.hasOwnProperty('mirror')) {
      if(!this._instruction.mirror.hasOwnProperty('instance')) {
        new List(this._context, this._instruction.mirror);
      }

      return this._instruction.mirror.instance._lazyItems();
    } else {
      if(!this.hasOwnProperty('_cachedItems')) {
        this._cachedItems = this._instruction.items;

        if(this._instruction.hasOwnProperty('extend')) {
          if(!this._instruction.extend.hasOwnProperty('instance')) {
            new List(this._context, this._instruction.extend);
          }

          this._cachedItems = this._instruction.extend.instance._lazyItems().concat(this._cachedItems);
        }
      }

      return this._cachedItems;
    }
  }

  _untouched() {
    if(!this._touched)
      return this;

    for(const item of this._lazyItems()) {
      if(!item.instance)
        return new field_module.Field(this._context, item);

      if(!item.instance._touched)
        return item.instance;
    }

    return false;
  }

  items() {
    this._touched = true;

    return this._lazyItems().map(item => item.instance || new field_module.Field(this._context, item));
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

  length() {
    this._touched = true;

    return this._lazyItems().length;
  }

  optionalStringValues() {
    this._touched = true;

    return this._lazyItems().map(item => {
      if(!item.hasOwnProperty('instance')) {
        new field_module.Field(this._context, item);
      }

      return item.instance.optionalStringValue();
    });
  }

  optionalValues(loader) {
    this._touched = true;

    return this._lazyItems().map(item => {
      if(!item.hasOwnProperty('instance')) {
        new field_module.Field(this._context, item);
      }

      return item.instance.optionalValue(loader);
    });
  }

  parent() {
    return this._instruction.parent.instance || new Section(this._context, this._instruction.parent);
  }

  raw() {
    const items = this._lazyItems()
                      .map(item => item.instance || new field_module.Field(this._context, item))
                      .map(instance => instance._lazyValue());

    return { [this._instruction.key]: items };
  }

  requiredStringValues() {
    this._touched = true;

    return this._lazyItems().map(item => {
      if(!item.hasOwnProperty('instance')) {
        new field_module.Field(this._context, item);
      }

      return item.instance.requiredStringValue();
    });
  }

  requiredValues(loader) {
    this._touched = true;

    return this._lazyItems().map(item => {
      if(!item.hasOwnProperty('instance')) {
        new field_module.Field(this._context, item);
      }

      return item.instance.requiredValue(loader);
    });
  }

  stringKey() {
    this._touched = true;

    return this._instruction.key;
  }

  toString() {
    return `[object List key=${this._instruction.key} items=${this._lazyItems().length}]`;
  }

  touch() {
    this._touched = true;

    for(let item of this._lazyItems()) {
      if(!item.hasOwnProperty('instance')) {
        new field_module.Field(this._context, item);
      }

      item.instance.touch();
    }
  }
}

exports.List = List;
