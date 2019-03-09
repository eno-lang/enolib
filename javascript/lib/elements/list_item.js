const { errors } = require('../errors/validation.js');
const list_module = require('./list.js');
const { ValueElement } = require('./value_element.js');

class ListItem extends ValueElement {
  constructor(context, instruction) {
    super(context, instruction);

    this._instruction.instance = this;
  }

  get [Symbol.toStringTag]() {
    return 'ListItem';
  }

  parent() {
    return this._instruction.parent.instance || new list_module.List(this._context, this._instruction.parent);
  }

  toString() {
    return `[object ListItem value=${this._printValue()}]`;
  }
}

exports.ListItem = ListItem;
