import { MissingValueElementBase } from './missing_value_element_base.js';

export class MissingEmbed extends MissingValueElementBase {
    get [Symbol.toStringTag]() {
        return 'MissingEmbed';
    }
    
    toString() {
        if (this._key === null)
            return `[object MissingEmbed]`;
        
        return `[object MissingEmbed key=${this._key}]`;
    }
}
