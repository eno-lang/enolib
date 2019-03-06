const missing_element_module = require('./missing_element.js');
const missing_field_module = require('./missing_field.js');
const missing_fieldset_module = require('./missing_fieldset.js');
const missing_list_module = require('./missing_list.js');

class MissingSection {
  constructor(key, parent) {
    this._key = key;
    this._parent = parent;
  }

  get [Symbol.toStringTag]() {
    return 'MissingSection';
  }

  _missingError(_element) {
    this._parent._missingError(this);
  }

  element(key = null) {
    return new missing_element_module.MissingElement(key, this);
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

  key(_loader) {
    this._parent._missingError(this);
  }

  list(key = null) {
    return new missing_list_module.MissingList(key, this);
  }

  lists(_key = null) {
    return [];
  }

  optionalComment(_loader) {
    return null;
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

  optionalStringComment() {
    return null;
  }

  raw() {
    return null;
  }

  requiredComment(_loader) {
    this._parent._missingError(this);
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

  requiredStringComment() {
    this._parent._missingError(this);
  }

  section(key = null) {
    return new MissingSection(key, this);
  }

  sections(_key = null) {
    return [];
  }

  stringKey() {
    this._parent._missingError(this);
  }

  toString() {
    return `[object MissingSection key="${this._key}"]`;
  }
}

exports.MissingSection = MissingSection;
