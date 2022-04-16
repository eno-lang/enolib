import { Field } from './field.js';
import { ValueElementBase } from './value_element_base.js';

export class Attribute extends ValueElementBase {
    get [Symbol.toStringTag]() {
        return 'Attribute';
    }
    
    parent() {
        return this._parent || new Field(this._context, this._instruction.parent);
    }
    
    toString() {
        return `[object Attribute key=${this._instruction.key} value=${this._printValue()}]`;
    }
}
