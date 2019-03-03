const { errors } = require('../errors/validation.js');
const { Element } = require('./element.js');
const field_module = require('./field.js');
const missing_field_module = require('./missing_field.js');

const { ELEMENT, FIELDSET } = require('../constants.js');

class Fieldset extends Element {
  constructor(context, instruction) {
    super(context, instruction);

    // Late determination by the application
    if(this._instruction.type === ELEMENT) {
      this._instruction.entries = [];
      this._instruction.type = FIELDSET;

      // Inherit _touched from possible Empty instance
      if(this._instruction.hasOwnProperty('instance')) {
        this._touched = this._instruction.instance._touched;
      }
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
    this._touched = true;

    const entriesMap = this._lazyEntries(true);

    if(!entriesMap.hasOwnProperty(key)) {
      if(required || this._allEntriesRequired) {
        throw errors.missingElement(this._context, key, this._instruction, 'missingFieldsetEntry');
      } else if(required === null) {
        return new missing_field_module.MissingField(key, this);
      } else {
        return null;
      }
    }

    if(entriesMap[key].length > 1)
      throw errors.unexpectedMultipleElements(this._context, key, entriesMap[key], 'expectedFieldsetEntryGotFieldsetEntries');

    const entry = entriesMap[key][0];

    return entry.instance || new field_module.Field(this._context, entry);
  }

  _lazyEntries(map = false) {
    if(this._instruction.hasOwnProperty('mirror')) {
      if(!this._instruction.mirror.hasOwnProperty('instance')) {
        new Fieldset(this._context, this._instruction.mirror);
      }

      return this._instruction.mirror.instance._lazyEntries(map);
    } else {
      if(!this.hasOwnProperty('_cachedEntries')) {
        this._cachedEntriesMap = {};
        this._cachedEntries = this._instruction.entries;

        for(const entry of this._cachedEntries) {
          if(this._cachedEntriesMap.hasOwnProperty(entry.key)) {
            this._cachedEntriesMap[entry.key].push(entry);
          } else {
            this._cachedEntriesMap[entry.key] = [entry];
          }
        }

        if(this._instruction.hasOwnProperty('extend')) {
          if(!this._instruction.extend.hasOwnProperty('instance')) {
            new Fieldset(this._context, this._instruction.extend);
          }

          const copiedEntries = this._instruction.extend.instance._lazyEntries().filter(entry =>
            !this._cachedEntriesMap.hasOwnProperty(entry.key)
          );

          this._cachedEntries = copiedEntries.concat(this._cachedEntries); // TODO: .push(...xy) somehow possible too? (but careful about order, which is relevant)

          for(const entry of copiedEntries) {
            if(this._cachedEntriesMap.hasOwnProperty(entry.key)) {
              this._cachedEntriesMap[entry.key].push(entry);
            } else {
              this._cachedEntriesMap[entry.key] = [entry];
            }
          }
        }
      }

      if(map) {
        return this._cachedEntriesMap;
      } else {
        return this._cachedEntries;
      }
    }
  }

  _missingError(entry) {
    throw errors.missingElement(this._context, entry._key, this._instruction, 'missingFieldsetEntry');
  }

  _untouched() {  // TODO: Revisit _untouched cascade throughout all element, clean up
    if(!this._touched)
      return this;

    for(const entry of this._lazyEntries()) {
      if(!entry.instance)
        return new field_module.Field(this._context, entry);

      if(!entry.instance._touched)
        return entry.instance;
    }

    return false;
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

    const entryMap = this._lazyEntries(true);

    for(const [key, entries] of Object.entries(entryMap)) {
      if(options.hasOwnProperty('except') && options.except.includes(key)) continue;
      if(options.hasOwnProperty('only') && !options.only.includes(key)) continue;

      for(const entry of entries) {
        if(!entry.instance || !entry.instance._touched) {
          if(typeof message === 'function') {
            message = message(entry);
          }

          throw errors.unexpectedElement(this._context, message, entry);
        }
      }
    }
  }

  entries(key = null) {
    this._touched = true;

    let entries;

    if(key === null) {
      entries = this._lazyEntries();
    } else {
      const entriesMap = this._lazyEntries(true);

      if(!entriesMap.hasOwnProperty(key))
        return [];

      entries = entriesMap[key];
    }

    return entries.map(entry => entry.instance || new field_module.Field(this._context, entry));
  }

  entry(key) {
    return this._entry(key);
  }

  key(loader) {
    this._touched = true;

    try {
      return loader(this._instruction.key);
    } catch(message) {
      throw errors.keyError(this._context, message, this._instruction);
    }
  }

  keyError(message) {
    return errors.keyError(
      this._context,
      typeof message === 'function' ? message(this._instruction.key) : message,
      this._instruction
    );
  }

  optionalEntry(key) {
    return this._entry(key, false);
  }

  parent() {
    return this._instruction.parent.instance || new Section(this._context, this._instruction.parent);
  }

  raw() {
    const entries = this._lazyEntries()
                        .map(entry => entry.instance || new field_module.Field(this._context, entry))
                        .map(instance => ({ [instance._instruction.key]: instance._lazyValue() }));

    return { [this._instruction.key]: entries };
  }

  requiredEntry(key) {
    return this._entry(key, true);
  }

  stringKey() {
    this._touched = true;

    return this._instruction.key;
  }

  toString() {
    return `[object Fieldset key=${this._instruction.key} entries=${this._lazyEntries().length}]`;
  }

  touch() {
    this._touched = true;

    for(let entry of this._lazyEntries()) {
      if(!entry.hasOwnProperty('instance')) {
        new field_module.Field(this._context, entry);
      }

      entry.instance.touch();
    }
  }
}

exports.Fieldset = Fieldset;
