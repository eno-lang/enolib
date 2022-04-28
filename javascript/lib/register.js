import { ElementBase } from './elements/element_base.js';
import { Field } from './elements/field.js';
import { MissingElementBase } from './elements/missing/missing_element_base.js';
import { MissingField } from './elements/missing/missing_field.js';
import { MissingValueElementBase } from './elements/missing/missing_value_element_base.js';
import { ValueElementBase } from './elements/value_element_base.js';

const _register = (name, func) => {
    if (name.match(/^\s*$/))
        throw new Error('Anonymous functions cannot be registered as loaders, please use register({ myName: myFunc }) or register({ myFunc }) syntax to explicitly provide a name.');
    
    if (name === 'string')
        throw new Error("You cannot register 'string' as a type/loader with enolib as this conflicts with the native string type accessors.");
    
    const titleCased = name.replace(/^./, inital => inital.toUpperCase());
    
    ElementBase.prototype[`${name}Key`] = function() { return this.key(func); };
    ElementBase.prototype[`optional${titleCased}Comment`] = function() { return this.optionalComment(func); };
    ElementBase.prototype[`required${titleCased}Comment`] = function() { return this.requiredComment(func); };
    ValueElementBase.prototype[`optional${titleCased}Value`] = function() { return this.optionalValue(func); };
    ValueElementBase.prototype[`required${titleCased}Value`] = function() { return this.requiredValue(func); };
    Field.prototype[`optional${titleCased}Values`] = function() { return this.optionalValues(func); };
    Field.prototype[`required${titleCased}Values`] = function() { return this.requiredValues(func); };
    MissingElementBase.prototype[`${name}Key`] = MissingElementBase.prototype.stringKey;
    MissingElementBase.prototype[`optional${titleCased}Comment`] = MissingElementBase.prototype.optionalStringComment;
    MissingElementBase.prototype[`required${titleCased}Comment`] = MissingElementBase.prototype.requiredStringComment;
    MissingValueElementBase.prototype[`optional${titleCased}Value`] = MissingValueElementBase.prototype.optionalStringValue;
    MissingValueElementBase.prototype[`required${titleCased}Value`] = MissingValueElementBase.prototype.requiredStringValue;
    MissingField.prototype[`optional${titleCased}Values`] = MissingField.prototype.optionalStringValues;
    MissingField.prototype[`required${titleCased}Values`] = MissingField.prototype.requiredStringValues;
};

// TODO: Document method signature on the website and here in JSDoc form
/**
* Globally register loaders in the enolib API
*/
export function register(...definitions) {
    for (const definition of definitions) {
        if (typeof definition === 'function') {
            _register(definition.name, definition);
        } else /* if (typeof definition === 'object') */ {
            for (const [name, func] of Object.entries(definition)) {
                _register(name, func);
            }
        }
    }
}
