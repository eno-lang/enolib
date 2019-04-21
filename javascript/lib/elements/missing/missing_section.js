const missing_empty_module = require('./missing_empty.js');
const missing_field_module = require('./missing_field.js');
const missing_fieldset_module = require('./missing_fieldset.js');
const missing_list_module = require('./missing_list.js');
const missing_section_element_module = require('./missing_section_element.js');

const { MissingElementBase } = require('./missing_element_base.js');

class MissingSection extends MissingElementBase {
  get [Symbol.toStringTag]() {
    return 'MissingSection';
  }

  empty(key = null) {
    return new missing_empty_module.MissingEmpty(key, this);
  }

  element(key = null) {
    return new missing_section_element_module.MissingSectionElement(key, this);
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

  optionalEmpty(_key = null) {
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

  requiredEmpty(_key = null) {
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
    if(this._key === null)
      return `[object MissingSection]`;

    return `[object MissingSection key=${this._key}]`;
  }
}

exports.MissingSection = MissingSection;
