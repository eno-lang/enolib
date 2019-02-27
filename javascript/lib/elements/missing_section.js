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

  element(key) {
    return new missing_element_module.MissingElement(key, this);
  }

  elements() {
    return [];
  }

  field(key) {
    return new missing_field_module.MissingField(key, this);
  }

  fields(_key) {
    return [];
  }

  fieldset(key) {
    return new missing_fieldset_module.MissingFieldset(key, this);
  }

  fieldsets(_key) {
    return [];
  }

  key(_loader) {
    this._parent._missingError(this);
  }

  list(key) {
    return new missing_list_module.MissingList(key, this);
  }

  lists(_key) {
    return [];
  }

  optionalComment(_loader) {
    return null;
  }

  optionalElement(_key) {
    return null;
  }

  optionalField(_key) {
    return null;
  }

  optionalFieldset(_key) {
    return null;
  }

  optionalList(_key) {
    return null;
  }

  optionalSection(_key) {
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

  requiredElement(_key) {
    this._parent._missingError(this);
  }

  requiredField(_key) {
    this._parent._missingError(this);
  }

  requiredFieldset(_key) {
    this._parent._missingError(this);
  }

  requiredList(_key) {
    this._parent._missingError(this);
  }

  requiredSection(_key) {
    this._parent._missingError(this);
  }

  requiredStringComment() {
    this._parent._missingError(this);
  }

  section(key) {
    return new MissingSection(key, this);
  }

  sections(_key) {
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
