const { errors } = require('../errors/validation.js');
const { Element } = require('./element.js');
const fieldset_entry_module = require('./fieldset_entry.js');
const missing_fieldset_entry_module = require('./missing_fieldset_entry.js');

class Fieldset extends Element {
  constructor(context, instruction, parent = null) {
    super(context, instruction, parent);

    this._allEntriesRequired = parent ? parent._allElementsRequired : false;
  }

  get [Symbol.toStringTag]() {
    return 'Fieldset';
  }

  _entries(map = false) {
    if(!this.hasOwnProperty('_instantiatedEntries')) {
      this._instantiatedEntries = [];
      this._instantiatedEntriesMap = {};
      this._instantiateEntries(this._instruction, this._instantiatedEntries, this._instantiatedEntriesMap);
    }

    return map ? this._instantiatedEntriesMap : this._instantiatedEntries;
  }

  _entry(key, required = null) {
    this._touched = true;

    let entries;
    if(key === null) {
      entries = this._entries();
    } else {
      const entriesMap = this._entries(true);
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
      throw errors.unexpectedMultipleElements(
        this._context,
        key,
        entries.map(entry => entry._instruction),
        'expectedSingleFieldsetEntry'
      );

    return entries[0];
  }

  _instantiateEntries(fieldset, entries = [], entriesMap = {}) {
    if(fieldset.hasOwnProperty('mirror')) {
      this._instantiateEntries(fieldset.mirror, entries, entriesMap);
    } else if(fieldset.hasOwnProperty('entries')) {
      const nativeEntries = fieldset.entries.filter(entry =>
        !entriesMap.hasOwnProperty(entry.key)
      ).map(entry => {
        const instance = new fieldset_entry_module.FieldsetEntry(this._context, entry, this);

        if(entriesMap.hasOwnProperty(entry.key)) {
          entriesMap[entry.key].push(instance);
        } else {
          entriesMap[entry.key] = [instance];
        }

        return instance;
      });

      if(fieldset.hasOwnProperty('extend')) {
        this._instantiateEntries(fieldset.extend, entries, entriesMap);
      }

      entries.push(...nativeEntries);
    }

    return [entries, entriesMap];
  }

  _missingError(entry) {
    throw errors.missingElement(this._context, entry._key, this._instruction, 'missingFieldsetEntry');
  }

  _untouched() {
    if(!this._touched)
      return this._instruction;

    const untouchedEntry = this._entries().find(entry => !entry._touched);

    return untouchedEntry ? untouchedEntry._instruction : false;
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

    const entryMap = this._entries(true);

    for(const [key, entries] of Object.entries(entryMap)) {
      if(options.hasOwnProperty('except') && options.except.includes(key)) continue;
      if(options.hasOwnProperty('only') && !options.only.includes(key)) continue;

      for(const entry of entries) {
        if(!entry.hasOwnProperty('_touched')) {
          if(typeof message === 'function') {
            message = message(entry);
          }

          throw errors.unexpectedElement(this._context, message, entry._instruction); // TODO: Consider all error implementations fetching the _instruction themselves?
        }
      }
    }
  }

  entries(key = null) {
    this._touched = true;

    let entries;

    if(key === null) {
      return this._entries();
    } else {
      const entriesMap = this._entries(true);

      if(!entriesMap.hasOwnProperty(key))
        return [];

      return entriesMap[key];
    }
  }

  entry(key = null) {
    return this._entry(key);
  }

  optionalEntry(key = null) {
    return this._entry(key, false);
  }

  parent() {
    return this._parent || new Section(this._context, this._instruction.parent);
  }

  requiredEntry(key = null) {
    return this._entry(key, true);
  }

  toString() {
    return `[object Fieldset key=${this._instruction.key} entries=${this._entries().length}]`;
  }

  touch() {
    // TODO: Potentially revisit this - maybe we can do a shallow touch, that is: propagating only to the hierarchy below that was already instantiated,
    //       while marking the deepest initialized element as _touchedRecursive/Deeply or something, which marks a border for _untouched() checks that
    //       does not have to be traversed deeper down. However if after that the hierarchy is used after all, the _touched property should be picked
    //       up starting at the element marked _touchedRecursive, passing the property down below.

    this._touched = true;

    for(const entry of this.entries()) {
      entry._touched = true;
    }
  }
}

exports.Fieldset = Fieldset;
