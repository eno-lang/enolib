const { Element } = require('./element.js');
const fieldset_module = require('./fieldset.js');
const list_module = require('./list.js');
const section_module = require('./section.js');
const { errors } = require('../errors/validation.js');

// TODO: Consider Field returning key() and stringKey() of parent list when it is a list item.
// Also strongly consider an actual Item / ListItem instance representation - even if probably lots of implications makes sense for type safety

const {
  CONTINUATION,
  ELEMENT,
  FIELD,
  FIELDSET,
  LIST,
  MULTILINE_FIELD_BEGIN,
  SECTION
} = require('../constants.js');

class Field extends Element {
  constructor(context, instruction) {
    super(context, instruction);

    // Late determination by the application
    if(this._instruction.type === ELEMENT) {
      this._instruction.continuations = [];
      this._instruction.type = FIELD;

      // Inherit _touched from possible Empty instance
      if(this._instruction.hasOwnProperty('instance')) {
        this._touched = this._instruction.instance._touched;
      }
    }

    this._instruction.instance = this;
  }

  get [Symbol.toStringTag]() {
    return 'Field';
  }

  _lazyValue() {
    if(!this.hasOwnProperty('_cachedValue')) {
      if(this._instruction.hasOwnProperty('mirror')) {
        if(!this._instruction.mirror.hasOwnProperty('instance')) {
          new Field(this._context, this._instruction.mirror);
        }

        return this._instruction.mirror.instance._lazyValue();
      } else {
        this._cachedValue = null;

        if(this._instruction.type === MULTILINE_FIELD_BEGIN) {
          if(this._instruction.lines.length > 0) {
            this._cachedValue = this._context.input.substring(
              this._instruction.lines[0].ranges.line[0],
              this._instruction.lines[this._instruction.lines.length - 1].ranges.line[1]
            );
          }
        } else {
          if(this._instruction.hasOwnProperty('value')) {
            this._cachedValue = this._instruction.value;
          }

          if(this._instruction.hasOwnProperty('continuations')) {
            let unappliedSpacing = false;

            for(let instruction of this._instruction.continuations) {
              if(this._cachedValue === null) {
                this._cachedValue = instruction.value;
                unappliedSpacing = false;
              } else if(instruction.value === null) {
                unappliedSpacing = unappliedSpacing || instruction.spaced;
              } else if(instruction.spaced || unappliedSpacing) {
                this._cachedValue += ' ' + instruction.value;
                unappliedSpacing = false;
              } else {
                this._cachedValue += instruction.value;
              }
            }
          }
        }
      }
    }

    return this._cachedValue;
  }

  _untouched() {
    return this._touched ? false : this; // TODO: Maybe the wrapper(s) for _untouched are unnecessary in the new low level arch with simpler empty<->typecast coupling
  }

  _value(loader, required) {
    this._touched = true;

    const value = this._lazyValue();

    if(value === null) {
      if(required)
        throw errors.missingValue(this._context, this._instruction);

      return null;
    }

    if(!loader)
      return value;

    try {
      return loader(value);
    } catch(message) {
      throw errors.valueError(this._context, message, this._instruction);
    }
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

  optionalStringValue() {
    return this._value(null, false);
  }

  optionalValue(loader) {
    return this._value(loader, false);
  }

  parent() {
    const parent = this._instruction.parent;

    if(!parent.hasOwnProperty('instance')) {
      switch(parent.type) {
        case SECTION: return new section_module.Section(this._context, parent);
        case LIST: return new list_module.List(this._context, parent);
        case FIELDSET: return new fieldset_module.Fieldset(this._context, parent);
      }
    }

    return parent.instance;
  }

  raw() {
    if(this._instruction.key) {
      return { [this._instruction.key]: this._lazyValue() };
    } else {
      return this._lazyValue();
    }
  }

  requiredStringValue() {
    return this._value(null, true);
  }

  requiredValue(loader) {
    return this._value(loader, true);
  }

  stringKey() {
    this._touched = true;

    return this._instruction.key;
  }

  toString() {
    let value = this._lazyValue();

    if(value === null) {
      value = 'null';
    } else {
      value = value.replace('\n', '\\n');
      if(value.length > 14) {
        value = value.substr(0, 11) + '...';
      }
      value = `"${value}"`;
    }

    if(this._instruction.key) {
      return `[object Field key=${this._instruction.key} value=${value}]`;
    } else {
      return `[object Field value=${value}]`;
    }
  }

  touch() {
    this._touched = true;
  }

  valueError(message) {
    return errors.valueError(
      this._context,
      typeof message === 'function' ? message(this._lazyValue()) : message,
      this._instruction
    );
  }
}

exports.Field = Field;
