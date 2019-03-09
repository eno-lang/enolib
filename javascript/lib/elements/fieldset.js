const { errors } = require('../errors/validation.js');
const { Element } = require('./element.js');
const field_module = require('./field.js');
const missing_fieldset_entry_module = require('./missing_fieldset_entry.js');

const { EMPTY_ELEMENT, FIELDSET } = require('../constants.js');

class Fieldset extends Element {
  constructor(context, instruction) {
    super(context, instruction);

    // TODO: Remove and adapt code here and elsewhere prominently to accomodate for fieldset without entries and still typed EMPTY_ELEMENT
    // Late determination by the application
    if(this._instruction.type === EMPTY_ELEMENT) {
      this._instruction.entries = [];
      this._instruction.type = FIELDSET;
    }

    instruction.instance = this;

    if(this._instruction.parent.hasOwnProperty('instance')) {
      this._allEntriesRequired = this._instruction.parent.instance._allElementsRequired;
    } else {
      this._allEntriesRequired = false;
    }
  }

  get [Symbol.toStringTag]() {
    return 'Fieldset';
  }

  _entry(key, required = null) {
    this._instruction.touched = true;

    let entries;
    if(key === null) {
      entries = this._context.entries(this._instruction);
    } else {
      const entriesMap = this._context.entries(this._instruction, true);
      entries = entriesMap.hasOwnProperty(key) ? entriesMap[key] : [];
    }

    if(entries.length === 0) {
      if(required || this._allEntriesRequired) {
        throw errors.missingElement(this._context, key, this._instruction, 'missingFieldsetEntry');
      } else if(required === null) {
        return new missing_fieldset_entry_module.MissingFieldsetEntry(key, this);
      } else {
        return null;
      }
    }

    if(entries.length > 1)
      throw errors.unexpectedMultipleElements(this._context, key, entries, 'expectedSingleFieldsetEntry');

    const entry = entries[0];

    return entry.instance || new field_module.Field(this._context, entry);
  }

  _missingError(entry) {
    throw errors.missingElement(this._context, entry._key, this._instruction, 'missingFieldsetEntry');
  }

  allEntriesRequired(required = true) {
    this._allEntriesRequired = required;
  }

  assertAllTouched(...optional) {
    let message = null;
    let options = {};

    for(const argument of optional) {
      if(typeof argument === 'object') {
        options = argument;
      } else {
        message = argument
      }
    }

    const entryMap = this._context.entries(this._instruction, true);

    for(const [key, entries] of Object.entries(entryMap)) {
      if(options.hasOwnProperty('except') && options.except.includes(key)) continue;
      if(options.hasOwnProperty('only') && !options.only.includes(key)) continue;

      for(const entry of entries) {
        if(!entry.hasOwnProperty('touched')) {
          if(typeof message === 'function') {
            message = message(entry.instance || new Field(this._context, entry));
          }

          throw errors.unexpectedElement(this._context, message, entry);
        }
      }
    }
  }

  entries(key = null) {
    this._instruction.touched = true;

    let entries;

    if(key === null) {
      entries = this._context.entries(this._instruction);
    } else {
      const entriesMap = this._context.entries(this._instruction, true);

      if(!entriesMap.hasOwnProperty(key))
        return [];

      entries = entriesMap[key];
    }

    return entries.map(entry => entry.instance || new field_module.Field(this._context, entry));
  }

  entry(key = null) {
    return this._entry(key);
  }

  optionalEntry(key = null) {
    return this._entry(key, false);
  }

  parent() {
    return this._instruction.parent.instance || new Section(this._context, this._instruction.parent);
  }

  requiredEntry(key = null) {
    return this._entry(key, true);
  }

  toString() {
    return `[object Fieldset key=${this._instruction.key} entries=${this._context.entries(this._instruction).length}]`;
  }
}

exports.Fieldset = Fieldset;
