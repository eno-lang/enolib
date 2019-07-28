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

// TODO: If this SectionElement gets touched (this._touched = true;),
//       the touched flag needs to be propagated down the hierarchy
//       when toSomething() is called to typecast the SectionElement.
//       I.e. the constructors for Field/Fieldset/etc. need to accept
//       this extra init parameter probably and it has to be passed
//       on lazily all the way down to the terminal leaves of the tree.
//       (applies to all implementations)

class SectionElement extends ElementBase {
  _untouched() {
    if(!this.hasOwnProperty('_yielded') && !this.hasOwnProperty('_touched'))
      return this._instruction;
    if(this.hasOwnProperty('_empty') && !this._empty.hasOwnProperty('_touched'))
      return this._instruction;
    if(this.hasOwnProperty('_field') && !this._field.hasOwnProperty('_touched'))
      return this._instruction;
    if(this.hasOwnProperty('_fieldset'))
      return this._fieldset._untouched();
    if(this.hasOwnProperty('_list'))
      return this._list._untouched();
    if(this.hasOwnProperty('_section'))
      return this._section._untouched();
  }

  _yields() {
    if(this._instruction.type === EMPTY_ELEMENT)
      return `${PRETTY_TYPES[EMPTY_ELEMENT]},${PRETTY_TYPES[FIELD]},${PRETTY_TYPES[FIELDSET]},${PRETTY_TYPES[LIST]}`;

    return PRETTY_TYPES[this._instruction.type];
  }

  toEmpty() {
    if(!this._empty) {
      if(this._yielded)
        throw new Error(`This element was already yielded as ${PRETTY_TYPES[this._yielded]} and can't be yielded again as a empty.`);

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
        throw new Error(`This element was already yielded as ${PRETTY_TYPES[this._yielded]} and can't be yielded again as a field.`);

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
        throw new Error(`This element was already yielded as ${PRETTY_TYPES[this._yielded]} and can't be yielded again as a fieldset.`);

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
        throw new Error(`This element was already yielded as ${PRETTY_TYPES[this._yielded]} and can't be yielded again as a list.`);

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

  /**
   * Returns a debug representation of this {@link SectionElement} in the form of `[object SectionElement key=foo yields=field]`.
   *
   * @return {string} A debug representation of this {@link SectionElement}.
   */
  toString() {
    return `[object SectionElement key=${this._key()} yields=${this._yields()}]`;
  }

  touch() {
    if(!this.hasOwnProperty('_yielded')) {
      this._touched = true;
    } else if(this.hasOwnProperty('_empty')) {
      this._empty._touched = true;
    } else if(this.hasOwnProperty('_field')) {
      this._field._touched = true;
    } else if(this.hasOwnProperty('_fieldset')) {
      this._fieldset.touch();
    } else if(this.hasOwnProperty('_list')) {
      this._list.touch();
    } else if(this.hasOwnProperty('_section')) {
      this._section.touch();
    }
  }

  yieldsEmpty() {
    return this._instruction.type === EMPTY_ELEMENT;
  }

  yieldsField() {
    return this._instruction.type === FIELD ||
           this._instruction.type === MULTILINE_FIELD_BEGIN ||
           this._instruction.type === EMPTY_ELEMENT;
  }

  yieldsFieldset() {
    return this._instruction.type === FIELDSET ||
           this._instruction.type === EMPTY_ELEMENT;
  }

  yieldsList() {
    return this._instruction.type === LIST ||
           this._instruction.type === EMPTY_ELEMENT;
  }

  yieldsSection() {
    return this._instruction.type === SECTION;
  }
}

exports.SectionElement = SectionElement;
