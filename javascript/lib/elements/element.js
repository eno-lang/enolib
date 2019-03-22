const fieldset_entry_module = require('./fieldset_entry.js');
const list_item_module = require('./list_item.js');

const { errors } = require('../errors/validation.js');
const { FIELDSET_ENTRY, LIST_ITEM } = require('../constants.js');
const { SectionElement } = require('./section_element.js');

class Element extends SectionElement {
  toFieldsetEntry() {
    if(!this._fieldsetEntry) {
      if(this._instruction.type !== FIELDSET_ENTRY)
        throw errors.unexpectedElementType(this._context, null, this._instruction, 'expectedFieldsetEntry');

      this._fieldsetEntry = new fieldset_entry_module.Fieldset(this._context, this._instruction); // TODO: parent missing? or: what if casting Element to Field (inherited from SectionElement) but does not have parent because originating from lookup? investigate
    }

    return this._fieldsetEntry;
  }

  toListItem() {
    if(!this._listItem) {
      if(this._instruction.type !== LIST_ITEM)
        throw errors.unexpectedElementType(this._context, null, this._instruction, 'expectedListItem');

      this._listItem = new list_item_module.ListItem(this._context, this._instruction); // TODO: parent missing? or: what if casting Element to Field (inherited from SectionElement) but does not have parent because originating from lookup? investigate
    }

    return this._listItem;
  }

  yieldsFieldsetEntry() {
    return this._instruction.type === FIELDSET_ENTRY;
  }

  yieldsListItem() {
    return this._instruction.type === LIST_ITEM;
  }
}

exports.Element = Element;
