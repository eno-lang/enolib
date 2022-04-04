const fieldset_entry_module = require('./fieldset_entry.js');
const list_item_module = require('./list_item.js');

const { errors } = require('../errors/validation.js');
const { ATTRIBUTE, DOCUMENT, ITEM } = require('../constants.js');
const { SectionElement } = require('./section_element.js');

// TODO: parent() implementation on Element and SectionElement ?

class Element extends SectionElement {
  toDocument() {
    if(this._instruction.type !== DOCUMENT)
      throw errors.unexpectedElementType(this._context, null, this._instruction, 'expectedDocument');

    if(!this._section) {
      this._section = new section_module.Section(this._context, this._instruction); // TODO: parent missing? or: what if casting Element to Field (inherited from SectionElement) but does not have parent because originating from lookup? investigate
      this._yielded = SECTION;
    }

    return this._section;
  }

  toFieldsetEntry() {
    if(!this._fieldsetEntry) {
      if (this._instruction.type !== ATTRIBUTE)
        throw errors.unexpectedElementType(this._context, null, this._instruction, 'expectedFieldsetEntry');

      this._fieldsetEntry = new fieldset_entry_module.Fieldset(this._context, this._instruction); // TODO: parent missing? or: what if casting Element to Field (inherited from SectionElement) but does not have parent because originating from lookup? investigate
    }

    return this._fieldsetEntry;
  }

  toListItem() {
    if (!this._listItem) {
        if (this._instruction.type !== ITEM)
            throw errors.unexpectedElementType(this._context, null, this._instruction, 'expectedListItem');

        this._listItem = new list_item_module.ListItem(this._context, this._instruction); // TODO: parent missing? or: what if casting Element to Field (inherited from SectionElement) but does not have parent because originating from lookup? investigate
    }

    return this._listItem;
  }

  toSection() {
    if(!this._section) {
      if(this._instruction.type !== SECTION && this._instruction.type !== DOCUMENT)
        throw errors.unexpectedElementType(this._context, null, this._instruction, 'expectedSection');

      this._section = new section_module.Section(this._context, this._instruction); // TODO: parent missing? or: what if casting Element to Field (inherited from SectionElement) but does not have parent because originating from lookup? investigate
      this._yielded = SECTION;
    }

    return this._section;
  }

  /**
   * Returns a debug representation of this {@link Element} in the form of `[object Element key=foo yields=field]`.
   *
   * @return {string} A debug representation of this {@link Element}.
   */
  toString() {
    return `[object Element key=${this._key()} yields=${this._yields()}]`;
  }

  yieldsDocument() {
    return this._instruction.type === DOCUMENT;
  }

    yieldsFieldsetEntry() {
        return this._instruction.type === ATTRIBUTE;
    }

    yieldsListItem() {
        return this._instruction.type === ITEM;
    }

  yieldsSection() {
    return this._instruction.type === SECTION ||
           this._instruction.type === DOCUMENT;
  }
}

exports.Element = Element;
