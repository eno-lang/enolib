const { Element } = require('./elements/element.js');
const { List } = require('./elements/list.js');
const { MissingElement } = require('./elements/missing_element.js');
const { MissingList } = require('./elements/missing_list.js');
const { MissingValueElement } = require('./elements/missing_value_element.js');
const { ValueElement } = require('./elements/value_element.js');

// TODO: Safe-guard against conflicting loader names (e.g. previous definition or native library function conflict)

const _register = (name, func) => {
  if(name.match(/^\s*$/))
    throw 'Anonymous functions cannot be registered as loaders, please use register({ myName: myFunc }) or register({ myFunc }) syntax to explicitly provide a name.';

  const titleCased = name.replace(/^./, inital => inital.toUpperCase());

  Element.prototype[`${name}Key`] = function() { return this.key(func); };
  Element.prototype[`optional${titleCased}Comment`] = function() { return this.optionalComment(func); };
  Element.prototype[`required${titleCased}Comment`] = function() { return this.requiredComment(func); };
  ValueElement.prototype[`optional${titleCased}Value`] = function() { return this.optionalValue(func); };
  ValueElement.prototype[`required${titleCased}Value`] = function() { return this.requiredValue(func); };
  List.prototype[`optional${titleCased}Values`] = function() { return this.optionalValues(func); };
  List.prototype[`required${titleCased}Values`] = function() { return this.requiredValues(func); };
  MissingElement.prototype[`${name}Key`] = MissingElement.prototype.stringKey;
  MissingElement.prototype[`optional${titleCased}Comment`] = MissingElement.prototype.optionalStringComment;
  MissingElement.prototype[`required${titleCased}Comment`] = MissingElement.prototype.requiredStringComment;
  MissingValueElement.prototype[`optional${titleCased}Value`] = MissingValueElement.prototype.optionalStringValue;
  MissingValueElement.prototype[`required${titleCased}Value`] = MissingValueElement.prototype.requiredStringValue;
  MissingList.prototype[`optional${titleCased}Values`] = MissingList.prototype.optionalStringValues;
  MissingList.prototype[`required${titleCased}Values`] = MissingList.prototype.requiredStringValues;
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
