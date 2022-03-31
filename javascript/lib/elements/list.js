const list_item_module = require('./list_item.js');
const section_module = require('./section.js');
const { ElementBase } = require('./element_base.js');

class List extends ElementBase {
  get [Symbol.toStringTag]() {
    return 'List';
  }

  _instantiateItems(list) {
    if(list.hasOwnProperty('items'))
      return list.items.map(item => new list_item_module.ListItem(this._context, item, this));
      
    return [];
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

  /**
   * Returns the items in this {@link List} as an array.
   *
   * @return {Field[]} The items in this {@link List}.
   */
  items() {
    this._touched = true;

    return this._items();
  }

  /**
   * Returns the number of items in this {@link List} as a `number`.
   *
   * @return {number} The number of items in this {@link List}.
   */
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

  /**
   * Returns the parent {@link Section}.
   *
   * @return {Section} The parent section.
   */
  parent() {
    return this._parent || new section_module.Section(this._context, this._instruction.parent);
  }

  requiredStringValues() {
    this._touched = true;

    return this._items().map(item => item.requiredStringValue());
  }

  requiredValues(loader) {
    this._touched = true;

    return this._items().map(item => item.requiredValue(loader));
  }

  /**
   * Returns a debug representation of this {@link List} in the form of `[object List key=foo items=2]`.
   *
   * @return {string} A debug representation of this {@link List}.
   */
  toString() {
    return `[object List key=${this._instruction.key} items=${this._items().length}]`;
  }

  touch() {
    this._touched = true;

    for (const item of this.items()) {
      item._touched = true;
    }
  }
}

exports.List = List;
