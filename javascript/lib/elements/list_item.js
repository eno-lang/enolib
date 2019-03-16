const list_module = require('./list.js');

const { ValueElementBase } = require('./value_element_base.js');

class ListItem extends ValueElementBase {
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
