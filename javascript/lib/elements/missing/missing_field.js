import { MissingAttribute } from './missing_attribute.js';
import { MissingValueElementBase } from './missing_value_element_base.js';

export class MissingField extends MissingValueElementBase {
    get [Symbol.toStringTag]() {
        return 'MissingField';
    }
    
    attribute(key = null) {
        return new MissingAttribute(key, this);
    }
    
    attributes(_key = null) {
        return [];
    }
    
    items() {
        return [];
    }
    
    optionalAttribute(_key = null) {
        return null;
    }
    
    optionalStringValues() {
        return [];
    }
    
    optionalValues(_loader) {
        return [];
    }
    
    requiredAttribute(_key = null) {
        this._parent._missingError(this);
    }
    
    requiredStringValues() {
        return [];
    }
    
    requiredValues(_loader) {
        return [];
    }
    
    toString() {
        if(this._key === null)
            return `[object MissingField]`;
        
        return `[object MissingField key=${this._key}]`;
    }
}
