const fieldset_entry_module = require('./fieldset_entry.js');
const section_module = require('./section.js');
const missing_fieldset_entry_module = require('./missing/missing_fieldset_entry.js');

const { ElementBase } = require('./element_base.js');
const { errors } = require('../errors/validation.js');

class Fieldset extends ElementBase {
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
      this._instantiateEntries(this._instruction);
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
      if(required || required === null && this._allEntriesRequired) {
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

  _instantiateEntries(fieldset) {
    if(fieldset.hasOwnProperty('entries')) {
      this._instantiatedEntries = fieldset.entries.filter(entry =>
        !this._instantiatedEntriesMap.hasOwnProperty(entry.key)
      ).map(entry => {
        const instance = new fieldset_entry_module.FieldsetEntry(this._context, entry, this);

        if(this._instantiatedEntriesMap.hasOwnProperty(entry.key)) {
          this._instantiatedEntriesMap[entry.key].push(instance);
        } else {
          this._instantiatedEntriesMap[entry.key] = [instance];
        }

        return instance;
      });
    }
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

  /**
   * Assert that all entries inside this fieldset have been touched
   * @param {string} message A static string error message or a message function taking the excess element and returning an error string
   * @param {object} options
   * @param {array} options.except An array of entry keys to exclude from assertion
   * @param {array} options.only Specifies to ignore all entries but the ones includes in this array of element keys
   */
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

    const entriesMap = this._entries(true);

    for(const [key, entries] of Object.entries(entriesMap)) {
      if(options.hasOwnProperty('except') && options.except.includes(key)) continue;
      if(options.hasOwnProperty('only') && !options.only.includes(key)) continue;

      for(const entry of entries) {
        if(!entry.hasOwnProperty('_touched')) {
          if(typeof message === 'function') {
            message = message(entry);  // TODO: This passes a FieldsetEntry while in section.assertAllTouched passes Element? Inconsisten probably
          }

          throw errors.unexpectedElement(this._context, message, entry._instruction); // TODO: Consider all error implementations fetching the _instruction themselves?
        }
      }
    }
  }

  /**
   * Returns the entries of this {@link Fieldset} as an array in the original document order.
   *
   * @param {string} [key] If provided only entries with the specified key are returned.
   * @return {Field[]} The entries of this {@link Fieldset}.
   */
  entries(key = null) {
    this._touched = true;

    if(key === null) {
      return this._entries();
    } else {
      const entriesMap = this._entries(true);

      if(!entriesMap.hasOwnProperty(key))
        return [];

      return entriesMap[key];
    }
  }

  /**
   * Returns the entry with the specified `key`.
   *
   * @param {string} [key] The key of the entry to return. Can be left out to validate and query a single entry with an arbitrary key.
   * @return {Field|MissingField} The entry with the specified key, if available, or a {@link MissingField} proxy instance.
   */
  entry(key = null) {
    return this._entry(key);
  }

  optionalEntry(key = null) {
    return this._entry(key, false);
  }

  /**
   * Returns the parent {@link Section}.
   *
   * @return {Section} The parent section.
   */
  parent() {
    return this._parent || new section_module.Section(this._context, this._instruction.parent);
  }

  requiredEntry(key = null) {
    return this._entry(key, true);
  }

  /**
   * Returns a debug representation of this {@link Fieldset} in the form of `[object Fieldset key=foo entries=2]`.
   *
   * @return {string} A debug representation of this {@link Fieldset}.
   */
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
