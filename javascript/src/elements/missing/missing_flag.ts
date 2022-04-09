import { MissingElementBase } from './missing_element_base.js';

export class MissingFlag extends MissingElementBase {
    get [Symbol.toStringTag]() {
        return 'MissingFlag';
    }
    
    toString() {
        if (this._key === null)
            return `[object MissingFlag]`;
        
        return `[object MissingFlag key=${this._key}]`;
    }
}
