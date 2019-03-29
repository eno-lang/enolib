const { ElementBase } = require('./elements/element_base.js');
const { List } = require('./elements/list.js');
const { MissingElementBase } = require('./elements/missing/missing_element_base.js');
const { MissingList } = require('./elements/missing/missing_list.js');
const { MissingValueElementBase } = require('./elements/missing/missing_value_element_base.js');
const { ValueElementBase } = require('./elements/value_element_base.js');

// TODO: Safe-guard against conflicting loader names (e.g. previous definition or native library function conflict)

const _register = (name, func) => {
  if(name.match(/^\s*$/))
    throw 'Anonymous functions cannot be registered as loaders, please use register({ myName: myFunc }) or register({ myFunc }) syntax to explicitly provide a name.';

  const titleCased = name.replace(/^./, inital => inital.toUpperCase());

  ElementBase.prototype[`${name}Key`] = function() { return this.key(func); };
  ElementBase.prototype[`optional${titleCased}Comment`] = function() { return this.optionalComment(func); };
  ElementBase.prototype[`required${titleCased}Comment`] = function() { return this.requiredComment(func); };
  ValueElementBase.prototype[`optional${titleCased}Value`] = function() { return this.optionalValue(func); };
  ValueElementBase.prototype[`required${titleCased}Value`] = function() { return this.requiredValue(func); };
  List.prototype[`optional${titleCased}Values`] = function() { return this.optionalValues(func); };
  List.prototype[`required${titleCased}Values`] = function() { return this.requiredValues(func); };
  MissingElementBase.prototype[`${name}Key`] = MissingElementBase.prototype.stringKey;
  MissingElementBase.prototype[`optional${titleCased}Comment`] = MissingElementBase.prototype.optionalStringComment;
  MissingElementBase.prototype[`required${titleCased}Comment`] = MissingElementBase.prototype.requiredStringComment;
  MissingValueElementBase.prototype[`optional${titleCased}Value`] = MissingValueElementBase.prototype.optionalStringValue;
  MissingValueElementBase.prototype[`required${titleCased}Value`] = MissingValueElementBase.prototype.requiredStringValue;
  MissingList.prototype[`optional${titleCased}Values`] = MissingList.prototype.optionalStringValues;
  MissingList.prototype[`required${titleCased}Values`] = MissingList.prototype.requiredStringValues;
};

exports.register = (...definitions) => {
  for(let definition of definitions) {
    if(typeof definition === 'function') {
      _register(definition.name, definition);
    } else /* if(typeof definition === 'object') */ {
      for(let [name, func] of Object.entries(definition)) {
        _register(name, func);
      }
    }
  }
};
