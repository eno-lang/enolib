const { Field } = require('./elements/field.js');
const { Fieldset } = require('./elements/fieldset.js');
const { List } = require('./elements/list.js');
const { MissingField } = require('./elements/missing_field.js');
const { MissingFieldset } = require('./elements/missing_fieldset.js');
const { MissingList } = require('./elements/missing_list.js');
const { MissingSection } = require('./elements/missing_section.js');
const { Section } = require('./elements/section.js');

// TODO: Safe-guard against conflicting loader names (e.g. previous definition or native library function conflict)

const _register = (name, func) => {
  if(name.match(/^\s*$/))
    throw 'Anonymous functions cannot be registered as loaders, please use register({ myName: myFunc }) or register({ myFunc }) syntax to explicitly provide a name.';

  const titleCased = name.replace(/^./, inital => inital.toUpperCase());

  Field.prototype[`optional${titleCased}Comment`] = function() { return this.optionalComment(func); };
  Field.prototype[`optional${titleCased}Value`] = function() { return this.optionalValue(func); };
  Field.prototype[`required${titleCased}Comment`] = function() { return this.requiredComment(func); };
  Field.prototype[`required${titleCased}Value`] = function() { return this.requiredValue(func); };
  Field.prototype[`${name}Key`] = function() { return this.key(func); };
  Fieldset.prototype[`optional${titleCased}Comment`] = function() { return this.optionalComment(func); };
  Fieldset.prototype[`required${titleCased}Comment`] = function() { return this.requiredComment(func); };
  Fieldset.prototype[`${name}Key`] = function() { return this.key(func); };
  List.prototype[`optional${titleCased}Comment`] = function() { return this.optionalComment(func); };
  List.prototype[`optional${titleCased}Values`] = function() { return this.optionalValues(func); };
  List.prototype[`required${titleCased}Comment`] = function() { return this.requiredComment(func); };
  List.prototype[`required${titleCased}Values`] = function() { return this.requiredValues(func); };
  List.prototype[`${name}Key`] = function() { return this.key(func); };
  MissingField.prototype[`optional${titleCased}Comment`] = MissingField.prototype.optionalStringComment;
  MissingField.prototype[`optional${titleCased}Value`] = MissingField.prototype.optionalStringValue;
  MissingField.prototype[`required${titleCased}Comment`] = MissingField.prototype.requiredStringComment;
  MissingField.prototype[`required${titleCased}Value`] = MissingField.prototype.requiredStringValue;
  MissingField.prototype[`${name}Key`] = MissingField.prototype.stringKey;
  MissingFieldset.prototype[`optional${titleCased}Comment`] = MissingFieldset.prototype.optionalStringComment;
  MissingFieldset.prototype[`required${titleCased}Comment`] = MissingFieldset.prototype.requiredStringComment;
  MissingFieldset.prototype[`${name}Key`] = MissingFieldset.prototype.stringKey;
  MissingList.prototype[`optional${titleCased}Comment`] = MissingList.prototype.optionalStringComment;
  MissingList.prototype[`optional${titleCased}Values`] = MissingList.prototype.optionalStringValues;
  MissingList.prototype[`required${titleCased}Comment`] = MissingList.prototype.requiredStringComment;
  MissingList.prototype[`required${titleCased}Values`] = MissingList.prototype.requiredStringValues;
  MissingList.prototype[`${name}Key`] = MissingList.prototype.stringKey;  // TODO: This and other dynamically registered API methods need to be revisited possibly
  MissingSection.prototype[`optional${titleCased}Comment`] = MissingSection.prototype.optionalStringComment;
  MissingSection.prototype[`required${titleCased}Comment`] = MissingSection.prototype.requiredStringComment;
  MissingSection.prototype[`${name}Key`] = MissingSection.prototype.stringKey;
  Section.prototype[`optional${titleCased}Comment`] = function() { return this.optionalComment(func); };
  Section.prototype[`required${titleCased}Comment`] = function() { return this.requiredComment(func); };
  Section.prototype[`${name}Key`] = function() { return this.key(func); };
};

exports.register = (...definitions) => {
  for(let definition of definitions) {
    if(typeof definition === 'function') {
      _register(definition.name, definition);
    } else if(typeof definition === 'object') {
      for(let [name, func] of Object.entries(definition)) {
        _register(name, func);
      }
    }
  }
};
