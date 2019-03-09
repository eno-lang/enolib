const { MissingElement } = require('./missing_element.js');
const missing_empty_module = require('./missing_empty.js');
const missing_field_module = require('./missing_field.js');
const missing_fieldset_module = require('./missing_fieldset.js');
const missing_list_module = require('./missing_list.js');
const missing_section_module = require('./missing_section.js');

// TODO: Split elements/ folder into elements/missing, etc.

class MissingAmbiguousSectionElement extends MissingElement {
  get [Symbol.toStringTag]() {
    return 'MissingAmbiguousSectionElement';
  }

  toEmpty() {
    return new missing_field_module.MissingEmpty(this._key, this._parent);
  }

  toField() {
    return new missing_field_module.MissingField(this._key, this._parent);
  }

  toFieldset() {
    return new missing_field_module.MissingFieldset(this._key, this._parent);
  }

  toList() {
    return new missing_field_module.MissingList(this._key, this._parent);
  }

  toSection() {
    return new missing_field_module.MissingSection(this._key, this._parent);
  }

  toString() {
    return `[object MissingAmbiguousSectionElement key="${this._key}"]`;
  }

  yieldsEmpty() {
    return true; // TODO: Throw instead?!
  }

  yieldsField() {
    return true; // TODO: Throw instead?!
  }

  yieldsFieldset() {
    return true; // TODO: Throw instead?!
  }

  yieldsList() {
    return true; // TODO: Throw instead?!
  }

  yieldsSection() {
    return true; // TODO: Throw instead?!
  }
}

exports.MissingAmbiguousSectionElement = MissingAmbiguousSectionElement;
