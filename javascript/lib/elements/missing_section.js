const { MissingElement } = require('./missing_element.js');
const missing_ambiguous_section_element_module = require('./missing_element.js');
const missing_field_module = require('./missing_field.js');
const missing_fieldset_module = require('./missing_fieldset.js');
const missing_list_module = require('./missing_list.js');

class MissingSection extends MissingElement {
  get [Symbol.toStringTag]() {
    return 'MissingSection';
  }

  element(key = null) {
    return new missing_ambiguous_section_element_module.MissingAmbiguousSectionElement(key, this);
  }

  elements(_key = null) {
    return [];
  }

  field(key = null) {
    return new missing_field_module.MissingField(key, this);
  }

  fields(_key = null) {
    return [];
  }

  fieldset(key = null) {
    return new missing_fieldset_module.MissingFieldset(key, this);
  }

  fieldsets(_key = null) {
    return [];
  }

  list(key = null) {
    return new missing_list_module.MissingList(key, this);
  }

  lists(_key = null) {
    return [];
  }

  optionalElement(_key = null) {
    return null;
  }

  optionalField(_key = null) {
    return null;
  }

  optionalFieldset(_key = null) {
    return null;
  }

  optionalList(_key = null) {
    return null;
  }

  optionalSection(_key = null) {
    return null;
  }

  requiredElement(_key = null) {
    this._parent._missingError(this);
  }

  requiredField(_key = null) {
    this._parent._missingError(this);
  }

  requiredFieldset(_key = null) {
    this._parent._missingError(this);
  }

  requiredList(_key = null) {
    this._parent._missingError(this);
  }

  requiredSection(_key = null) {
    this._parent._missingError(this);
  }

  section(key = null) {
    return new MissingSection(key, this);
  }

  sections(_key = null) {
    return [];
  }

  toString() {
    return `[object MissingSection key="${this._key}"]`;
  }
}

exports.MissingSection = MissingSection;
