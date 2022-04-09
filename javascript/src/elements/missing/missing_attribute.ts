import { MissingValueElementBase } from './missing_value_element_base.js';

export class MissingAttribute extends MissingValueElementBase {
    get [Symbol.toStringTag]() {
        return 'MissingAttribute';
    }
    
    toString() {
        if (this._key === null)
            return `[object MissingAttribute]`;
        
        return `[object MissingAttribute key=${this._key}]`;
    }
}
