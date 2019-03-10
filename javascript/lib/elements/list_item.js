const list_module = require('./list.js');
const { ValueElement } = require('./value_element.js');

class ListItem extends ValueElement {
  get [Symbol.toStringTag]() {
    return 'ListItem';
  }

  parent() {
    return this._parent || new list_module.List(this._context, this._instruction.parent);
  }

  toString() {
    return `[object ListItem value=${this._printValue()}]`;
  }
}

exports.ListItem = ListItem;
