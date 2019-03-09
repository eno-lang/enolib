const { Element } = require('./element.js');
const { errors } = require('../errors/validation.js');
const list_item_module = require('./list_item.js');

const { EMPTY_ELEMENT, LIST } = require('../constants.js');

class List extends Element {
  constructor(context, instruction) {
    super(context, instruction);

    // Late determination by the application
    if(this._instruction.type === EMPTY_ELEMENT) {
      this._instruction.items = [];
      this._instruction.type = LIST;
    }

    this._instruction.instance = this;
  }

  get [Symbol.toStringTag]() {
    return 'List';
  }

  items() {
    this._instruction.touched = true;

    return this._context.items(this._instruction).map(item => item.instance || new list_item_module.ListItem(this._context, item));
  }

  length() {
    this._instruction.touched = true;

    return this._context.items(this._instruction).length;
  }

  optionalStringValues() {
    this._instruction.touched = true;

    return this._context.items(this._instruction).map(item => {
      if(!item.hasOwnProperty('instance')) {
        new list_item_module.ListItem(this._context, item);
      }

      return item.instance.optionalStringValue();
    });
  }

  optionalValues(loader) {
    this._instruction.touched = true;

    return this._context.items(this._instruction).map(item => {
      if(!item.hasOwnProperty('instance')) {
        new list_item_module.ListItem(this._context, item);
      }

      return item.instance.optionalValue(loader);
    });
  }

  parent() {
    return this._instruction.parent.instance || new Section(this._context, this._instruction.parent);
  }

  requiredStringValues() {
    this._instruction.touched = true;

    return this._context.items(this._instruction).map(item => {
      if(!item.hasOwnProperty('instance')) {
        new list_item_module.ListItem(this._context, item);
      }

      return item.instance.requiredStringValue();
    });
  }

  requiredValues(loader) {
    this._instruction.touched = true;

    return this._context.items(this._instruction).map(item => {
      if(!item.hasOwnProperty('instance')) {
        new list_item_module.ListItem(this._context, item);
      }

      return item.instance.requiredValue(loader);
    });
  }

  toString() {
    return `[object List key=${this._instruction.key} items=${this._context.items(this._instruction).length}]`;
  }
}

exports.List = List;
