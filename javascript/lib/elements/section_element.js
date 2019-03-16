const empty_module = require('./empty.js');
const field_module = require('./field.js');
const fieldset_module = require('./fieldset.js');
const list_module = require('./list.js');
const section_module = require('./section.js');

const { ElementBase } = require('./element_base.js');
const { errors } = require('../errors/validation.js');

const {
  EMPTY_ELEMENT,
  FIELD,
  FIELDSET,
  LIST,
  MULTILINE_FIELD_BEGIN,
  PRETTY_TYPES,
  SECTION
} = require('../constants.js');

class SectionElement extends ElementBase {
  _untouched() {
    if(!this._yielded)
      return this._instruction;

    if(this._empty && !this._empty._touched) return this._instruction;
    if(this._field && !this._field._touched) return this._instruction;
    if(this._fieldset) return this._fieldset._untouched();
    if(this._list) return this._list._untouched();
    if(this._section) return this._section._untouched();
  }

  toEmpty() {
    if(!this._empty) {
      if(this._yielded)
        throw `This element was already yielded as ${PRETTY_TYPES[this._yielded]} and can't be yielded again as a empty.`;

      if(this._instruction.type !== EMPTY_ELEMENT)
        throw errors.unexpectedElementType(this._context, null, this._instruction, 'expectedEmpty');

      this._empty = new empty_module.Empty(this._context, this._instruction, this._parent);
      this._yielded = EMPTY_ELEMENT;
    }

    return this._empty;
  }

  toField() {
    if(!this._field) {
      if(this._yielded)
        throw `This element was already yielded as ${PRETTY_TYPES[this._yielded]} and can't be yielded again as a field.`;

      if(this._instruction.type != FIELD &&
         this._instruction.type !== MULTILINE_FIELD_BEGIN &&
         this._instruction.type !== EMPTY_ELEMENT)
        throw errors.unexpectedElementType(this._context, null, this._instruction, 'expectedField');

      this._field = new field_module.Field(this._context, this._instruction, this._parent);
      this._yielded = FIELD;
    }

    return this._field;
  }

  toFieldset() {
    if(!this._fieldset) {
      if(this._yielded)
        throw `This element was already yielded as ${PRETTY_TYPES[this._yielded]} and can't be yielded again as a fieldset.`;

      if(this._instruction.type !== FIELDSET && this._instruction.type !== EMPTY_ELEMENT)
        throw errors.unexpectedElementType(this._context, null, this._instruction, 'expectedFieldset');

      this._fieldset = new fieldset_module.Fieldset(this._context, this._instruction, this._parent);
      this._yielded = FIELDSET;
    }

    return this._fieldset;
  }

  toList() {
    if(!this._list) {
      if(this._yielded)
        throw `This element was already yielded as ${PRETTY_TYPES[this._yielded]} and can't be yielded again as a list.`;

      if(this._instruction.type !== LIST && this._instruction.type !== EMPTY_ELEMENT)
        throw errors.unexpectedElementType(this._context, null, this._instruction, 'expectedList');

      this._list = new list_module.List(this._context, this._instruction, this._parent);
      this._yielded = LIST;
    }

    return this._list;
  }

  toSection() {
    if(!this._section) {
      if(this._instruction.type !== SECTION)
        throw errors.unexpectedElementType(this._context, null, this._instruction, 'expectedSection');

      this._section = new section_module.Section(this._context, this._instruction, this._parent);
      this._yielded = SECTION;
    }

    return this._section;
  }

  touch() {
    if(!this._yielded)  // TODO: Here we accutely would need the "marked touched below" with later repropagation mechanism
      return;

    if(this._empty) { this._empty._touched = true; }
    if(this._field) { this._field._touched = true; }
    if(this._fieldset) { this._fieldset.touch(); }
    if(this._list) { this._list.touch(); }
    if(this._section) { this._section.touch(); }
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

exports.SectionElement = SectionElement;
