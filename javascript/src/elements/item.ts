import { Field } from './field.js';
import { ValueElementBase } from './value_element_base.js';

export class Item extends ValueElementBase {
    get [Symbol.toStringTag]() {
        return 'Item';
    }
    
    parent() {
        return this._parent || new Field(this._context, this._instruction.parent);
    }
    
    toString() {
        return `[object Item value=${this._printValue()}]`;
    }
}
