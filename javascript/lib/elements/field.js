import { Attribute } from './attribute.js';
import { errors } from '../errors/validation.js';
import { Item } from './item.js';
import { MissingAttribute } from './missing/missing_attribute.js';
import { Section } from './section.js';
import { ValueElementBase } from './value_element_base.js';
import { 
    ID_CONTAINS_ATTRIBUTES,
    ID_CONTAINS_CONTINUATIONS,
    ID_CONTAINS_ITEMS,
    ID_CONTAINS_VALUE
 } from '../constants.js';

export class Field extends ValueElementBase {
    constructor(context, instruction, parent = null) {
        super(context, instruction, parent);
        
        this._allAttributesRequired = parent ? parent._allElementsRequired : false;
    }
    
    get [Symbol.toStringTag]() {
        return 'Field';
    }

    _attribute(key, required = null) {
        this._touched = true;
        
        const attributes = this._attributes(key);
        
        if (attributes.length === 0) {
            if (required || required === null && this._allAttributesRequired) {
                throw errors.missingElement(this._context, key, this._instruction, 'missingAttribute');
            } else if (required === null) {
                return new MissingAttribute(key, this);
            } else {
                return null;
            }
        }
        
        if (attributes.length > 1)
            throw errors.unexpectedMultipleElements(
                this._context,
                key,
                attributes.map(attribute => attribute._instruction),
                'expectedSingleAttribute'
            );
        
        return attributes[0];
    }
    
    _attributes(key = null) {
        if (!this.hasOwnProperty('_instantiatedAttributes')) {
            this._instantiatedAttributesMap = {};
            
            if (this._instruction.id & ID_CONTAINS_ATTRIBUTES) {
                this._instantiatedAttributes = this._instruction.attributes.map(attribute => {
                    const instance = new Attribute(this._context, attribute, this);
                    
                    if (this._instantiatedAttributesMap.hasOwnProperty(attribute.key)) {
                        this._instantiatedAttributesMap[attribute.key].push(instance);
                    } else {
                        this._instantiatedAttributesMap[attribute.key] = [instance];
                    }
                    
                    return instance;
                });
            } else {
                this._instantiatedAttributes = [];
            }
        }
        
        if (key === null) {
            return this._instantiatedAttributes;
        } else if (this._instantiatedAttributesMap.hasOwnProperty(key)) {
            return this._instantiatedAttributesMap[key];
        } else {
            return [];
        }
    }
    
    _items() {
        if (!this.hasOwnProperty('_instantiatedItems')) {
            if (this._instruction.id & ID_CONTAINS_ITEMS) {
                this._instantiatedItems = this._instruction.items.map(item => new Item(this._context, item, this));
            } else {
                this._instantiatedItems = [];
            }
        }
        
        return this._instantiatedItems;
    }
    
    // TODO: Migrated in from "Fieldset" - probably needs revisiting as the context is now broader (field vs. fieldset)
    _missingError(attribute) {
        throw errors.missingElement(this._context, attribute._key, this._instruction, 'missingAttribute');
    }
    
    _untouched() {
        if (!this._touched)
            return this._instruction;
        
        if (this._instruction.id & ID_CONTAINS_ATTRIBUTES) {
            const untouchedAttribute = this._attributes().find(attribute => !attribute._touched);
            if (untouchedAttribute)
                return untouchedAttribute;
        } else if (this._instruction.id & ID_CONTAINS_ITEMS) {
            const untouchedItem = this._items().find(item => !item._touched);
            if (untouchedItem)
                return untouchedItem;
        }
        
        return false;
    }
    
    _value(loader, required) {
        this._touched = true;
        
        if (this._instruction.id & (ID_CONTAINS_ATTRIBUTES | ID_CONTAINS_ITEMS)) {
            throw errors.unexpectedFieldContent(this._context, null, this._instruction, 'expectedValue');
        }
        
        const value = this._context.value(this._instruction);
        
        if (value === null) {
            if (required)
                throw errors.missingValue(this._context, this._instruction);
            
            return null;
        }
        
        if (!loader)
            return value;
        
        try {
            return loader(value);
        } catch (message) {
            throw errors.valueError(this._context, message, this._instruction);
        }
    }
    
    allAttributesRequired(required = true) {
        this._allAttributesRequired = required;
    }
    
    /**
    * Assert that all attributes inside this field have been touched
    * @param {string} message A static string error message or a message function taking the excess element and returning an error string
    * @param {object} options
    * @param {array} options.except An array of attribute keys to exclude from assertion
    * @param {array} options.only Specifies to ignore all attributes but the ones included in this array of element keys
    */
    assertAllTouched(...optional) {
        let message = null;
        let options = {};
        
        for (const argument of optional) {
            if (typeof argument === 'object') {
                options = argument;
            } else {
                message = argument
            }
        }
        
        // TODO: Whoops we need the ability to return the entire attributesMap after all ... (re-build/fix somehow again)
        const attributesMap = this._attributes(true);
        
        for (const [key, attributes] of Object.entries(attributesMap)) {
            if (options.hasOwnProperty('except') && options.except.includes(key)) continue;
            if (options.hasOwnProperty('only') && !options.only.includes(key)) continue;
            
            for (const attribute of attributes) {
                if (!attribute.hasOwnProperty('_touched')) {
                    if (typeof message === 'function') {
                        message = message(attribute);  // TODO: This passes an Attribute while in section.assertAllTouched passes Element? Inconsistent probably
                    }
                    
                    throw errors.unexpectedElement(this._context, message, attribute._instruction);
                }
            }
        }
    }
    
    /**
    * Returns the attribute with the specified `key`.
    *
    * @param {string} [key] The key of the attribute to return. Can be left out to validate and query a single attribute with an arbitrary key.
    * @return {Field|MissingField} The attribute with the specified key, if available, or a {@link MissingField} proxy instance.
    */
    attribute(key = null) {
        return this._attribute(key);
    }
    
    /**
    * Returns the attributes of this {@link Field} as an array in the original document order.
    *
    * @param {string} [key] If provided only attributes with the specified key are returned.
    * @return {Attribute[]} The attributes of this {@link Field}.
    */
    attributes(key = null) {
        this._touched = true;
        
        if (this._instruction.id & (ID_CONTAINS_CONTINUATIONS | ID_CONTAINS_ITEMS | ID_CONTAINS_VALUE)) {
            throw errors.unexpectedFieldContent(this._context, key, this._instruction, 'expectedAttributes');
        }
        
        return this._attributes(key);
    }
    
    /**
     * Returns the items in this {@link Field} as an array.
     *
     * @return {Item[]} The items in this {@link Field}.
     */
    items() {
      this._touched = true;
      
      // TODO: Here and elsewhere move this into this._items() rather (?)
      if (this._instruction.id & (ID_CONTAINS_ATTRIBUTES | ID_CONTAINS_CONTINUATIONS | ID_CONTAINS_VALUE)) {
          throw errors.unexpectedFieldContent(this._context, null, this._instruction, 'expectedItems');
      }

      return this._items();
    }
    
    /**
    * Returns the number of items in this {@link Field} as a `number`.
    *
    * @return {number} The number of items in this {@link Field}.
    */
    length() {
        this._touched = true;
        
        if (this._instruction.id & ID_CONTAINS_ATTRIBUTES)
            return this._attributes().length;

        if (this._instruction.id & ID_CONTAINS_ITEMS)
            return this._items().length;
            
        return 0;
    }
    
    optionalAttribute(key = null) {
        // TODO: Error if this field has items/value
        
        return this._attribute(key, false);
    }
    
    /**
    * Returns the value of this {@link Field} as a `string` and touches the element.
    * Returns `null` if there is no value.
    *
    * @return {?string} The value of this {@link Field} as a `string`, or `null`.
    */
    optionalStringValue() {
        // TODO: Error if this field has attributes/items
        
        return this._value(null, false);
    }
    
    optionalStringValues() {
        this._touched = true;
        
        // TODO: Error if this field has attributes/value
        
        return this._items().map(item => item.optionalStringValue());
    }
    
    /**
    * Passes the value of this {@link Field} through the provided loader, returns the result and touches the element.
    * The loader is only invoked if there is a value, otherwise `null` is returned directly.
    * Throws a {@link ValidationError} if an error is intercepted from the loader.
    *
    * @example
    * // Given a field containing the value 'foo' ...
    *
    * field.optionalValue(value => value.toUpperCase()); // returns 'FOO'
    * field.optionalValue(value => { throw 'You shall not pass!'; }); // throws an error based on the intercepted error message
    *
    * // Given a field containing no value ...
    *
    * field.optionalValue(value => value.toUpperCase()); // returns null
    * field.optionalValue(value => { throw 'You shall not pass!'; }); // returns null
    *
    * @param {function(value: string): any} loader A loader function taking a `string` value and returning any other type or throwing a `string` message.
    * @return {?any} The result of applying the provided loader to this {@link Field}'s value, or `null` when empty.
    * @throws {ValidationError} Thrown when an error from the loader is intercepted.
    */
    optionalValue(loader) {
        return this._value(loader, false);
    }
    
    optionalValues(loader) {
        this._touched = true;
        
        // TODO: Error if this field has attributes/value
        
        return this._items().map(item => item.optionalValue(loader));
    }
    
    /**
    * Returns the parent {@link Section}.
    *
    * @return {Section} The parent section.
    */
    parent() {
        return this._parent || new Section(this._context, this._instruction.parent);
    }
    
    requiredAttribute(key = null) {
        if (this._instruction.id & (ID_CONTAINS_CONTINUATIONS | ID_CONTAINS_ITEMS | ID_CONTAINS_VALUE))
            throw errors.unexpectedFieldContent(this._context, key, this._instruction, 'expectedAttributes');
        
        return this._attribute(key, true);
    }
    
    /**
    * Returns the value of this {@link Field} as a `string` and touches the element.
    * Throws a {@link ValidationError} if there is no value or the field contains attributes or items.
    *
    * @return {string} The value of this {@link Field} as a `string`.
    * @throws {ValidationError} Thrown when there is no value or the field contains attributes or items.
    */
    requiredStringValue() {
        return this._value(null, true);
    }
    
    requiredStringValues() {
        this._touched = true;
        
        if (this._instruction.id & (ID_CONTAINS_ATTRIBUTES | ID_CONTAINS_CONTINUATIONS | ID_CONTAINS_VALUE))
            throw errors.unexpectedFieldContent(this._context, null, this._instruction, 'expectedItems');
        
        return this._items().map(item => item.requiredStringValue());
    }
    
    /**
    * Passes the value of this {@link Field} through the provided loader, returns the result and touches the element.
    * The loader is only invoked if there is a value, otherwise a {@link ValidationError} is thrown directly.
    * Also throws a {@link ValidationError} if an error is intercepted from the loader.
    *
    * @example
    * // Given a field containing the value 'foo' ...
    *
    * field.requiredValue(value => value.toUpperCase()); // returns 'FOO'
    * field.requiredValue(value => { throw 'You shall not pass!'; }); // throws an error based on the intercepted error message
    *
    * // Given a field containing no value ...
    *
    * field.requiredValue(value => value.toUpperCase()); // throws an error stating that a required value is missing
    * field.requiredValue(value => { throw 'You shall not pass!'; }); // throws an error stating that a required value is missing
    *
    * @param {function(value: string): any} loader A loader function taking a `string` value and returning any other type or throwing a `string` message.
    * @return {any} The result of applying the provided loader to this {@link Field}'s value.
    * @throws {ValidationError} Thrown when there is no value or an error from the loader is intercepted.
    */
    requiredValue(loader) {
        return this._value(loader, true);
    }
    
    requiredValues(loader) {
        this._touched = true;
        
        if (this._instruction.id & (ID_CONTAINS_ATTRIBUTES | ID_CONTAINS_CONTINUATIONS | ID_CONTAINS_VALUE))
            throw errors.unexpectedFieldContent(this._context, null, this._instruction, 'expectedItems');
        
        return this._items().map(item => item.requiredValue(loader));
    }
    
    /**
    * Returns a debug representation of this {@link Field} in one of the respective forms:
    * - `[object Field key=foo attributes=2]`
    * - `[object Field key=foo items=2]`
    * - `[object Field key=foo value=bar]`
    *
    * @return {string} A debug representation of this {@link Field}.
    */
    toString() {
        if (this._instruction.id & ID_CONTAINS_ATTRIBUTES)
            return `[object Field key=${this._instruction.key} attributes=${this._instruction.attributes.length}]`;
        if (this._instruction.id & ID_CONTAINS_ITEMS)
            return `[object Field key=${this._instruction.key} items=${this._instruction.items.length}]`;
        if (this._instruction.id & ID_CONTAINS_VALUE)
            return `[object Field key=${this._instruction.key} value=${this._printValue()}]`;
        
        return `[object Field key=${this._instruction.key}]`;
    }
    
    touch() {
        // TODO: Potentially revisit this - maybe we can do a shallow touch, that is: propagating only to the hierarchy below that was already instantiated,
        //       while marking the deepest initialized element as _touchedRecursive/Deeply or something, which marks a border for _untouched() checks that
        //       does not have to be traversed deeper down. However if after that the hierarchy is used after all, the _touched property should be picked
        //       up starting at the element marked _touchedRecursive, passing the property down below.
        
        this._touched = true;
        
        if (this._instruction.id & ID_CONTAINS_ATTRIBUTES) {
            for (const attribute of this.attributes()) {
                attribute._touched = true;
            }
        } else if (this._instruction.id & ID_CONTAINS_ITEMS) {
            for (const item of this.items()) {
                item._touched = true;
            }
        }
    }
}
