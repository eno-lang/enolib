const { Element } = require('./element.js');
const list_item_module = require('./list_item.js');

const { EMPTY_ELEMENT, LIST } = require('../constants.js');

class List extends Element {
  get [Symbol.toStringTag]() {
    return 'List';
  }

  _instantiateItems(list) {
    if(list.hasOwnProperty('mirror')) {
      return this._instantiateItems(list.mirror);
    } else if(list.hasOwnProperty('extend')) {
      return [
        ...this._instantiateItems(list.extend),
        ...list.items.map(item => new list_item_module.ListItem(this._context, item, this))
      ];
    } else {
      if(!list.hasOwnProperty('items'))
        return [];

      return list.items.map(item => new list_item_module.ListItem(this._context, item, this));
    }
  }

  _items() {
    if(!this.hasOwnProperty('_instantiatedItems')) {
      this._instantiatedItems = this._instantiateItems(this._instruction);
    }

    return this._instantiatedItems;
  }

  _untouched() {
    if(!this._touched)
      return this._instruction;

    const untouchedItem = this._items().find(item => !item._touched);

    return untouchedItem ? untouchedItem._instruction : false;
  }

  items() {
    this._touched = true;

    return this._items();
  }

  length() {
    this._touched = true;

    return this._items().length;
  }

  optionalStringValues() {
    this._touched = true;

    return this._items().map(item => item.optionalStringValue());
  }

  optionalValues(loader) {
    this._touched = true;

    return this._items().map(item => item.optionalValue(loader));
  }

  parent() {
    return this._parent || new Section(this._context, this._instruction.parent);
  }

  requiredStringValues() {
    this._touched = true;

    return this._items().map(item => item.requiredStringValue());
  }

  requiredValues(loader) {
    this._touched = true;

    return this._items().map(item => item.requiredValue(loader));
  }

  toString() {
    return `[object List key=${this._instruction.key} items=${this._items().length}]`;
  }

  touch() {
    this._touched = true;

    for(const item of this.items()) {
      item._touched = true;
    }
  }
}

exports.List = List;
