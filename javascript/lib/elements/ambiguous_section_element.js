const { Element } = require('./element.js');
const { errors } = require('../errors/validation.js');
const empty_module = require('./empty.js');
const field_module = require('./field.js');
const fieldset_module = require('./fieldset.js');
const list_module = require('./list.js');
const section_module = require('./section.js');

const {
  EMPTY_ELEMENT,
  FIELD,
  FIELDSET,
  LIST,
  MULTILINE_FIELD_BEGIN,
  SECTION
} = require('../constants.js');

class AmbiguousSectionElement extends Element {
  toEmpty() {
    if(this._instruction.type === EMPTY_ELEMENT) {
      return this._instruction.instance || new empty_module.Empty(this._context, this._instruction);
    } else {
      throw errors.unexpectedElementType(this._context, null, this._instruction, 'expectedEmpty');
    }
  }

  toField() {
    if(this._instruction.type === FIELD ||
       this._instruction.type === MULTILINE_FIELD_BEGIN ||
       this._instruction.type === EMPTY_ELEMENT) {
      return this._instruction.instance || new field_module.Field(this._context, this._instruction);
    } else {
      throw errors.unexpectedElementType(this._context, null, this._instruction, 'expectedField');
    }
  }

  toFieldset() {
    if(this._instruction.type === FIELDSET || this._instruction.type === EMPTY_ELEMENT) {
      return this._instruction.instance || new fieldset_module.Fieldset(this._context, this._instruction);
    } else {
      throw errors.unexpectedElementType(this._context, null, this._instruction, 'expectedFieldset');
    }
  }

  toList() {
    if(this._instruction.type === LIST || this._instruction.type === EMPTY_ELEMENT) {
      return this._instruction.instance || new list_module.List(this._context, this._instruction);
    } else {
      throw errors.unexpectedElementType(this._context, null, this._instruction, 'expectedList');
    }
  }

  toSection() {
    if(this._instruction.type === SECTION) {
      return this._instruction.instance || new section_module.Section(this._context, this._instruction);
    } else {
      throw errors.unexpectedElementType(this._context, null, this._instruction, 'expectedSection');
    }
  }

  yieldsEmpty() {
    return this._instruction.type === EMPTY_ELEMENT;
  }

  yieldsField() {
    return this._instruction.type === EMPTY_ELEMENT ||
           this._instruction.type === FIELD ||
           this._instruction.type === MULTILINE_FIELD_BEGIN;
  }

  yieldsFieldset() {
    return this._instruction.type === FIELDSET;
  }

  yieldsList() {
    return this._instruction.type === LIST;
  }

  yieldsSection() {
    return this._instruction.type === SECTION;
  }
}

exports.AmbiguousSectionElement = AmbiguousSectionElement;
