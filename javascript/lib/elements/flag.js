import { ElementBase } from './element_base.js';
import { Section } from './section.js';

export class Flag extends ElementBase {
    get [Symbol.toStringTag]() {
        return 'Flag';
    }
    
    parent() {
        return this._parent || new Section(this._context, this._instruction.parent);
    }
    
    /**
    * Returns a debug representation of this {@link Flag} in the form of `[object Flag key=foo]`.
    *
    * @return {string} A debug representation of this {@link Flag}.
    */
    toString() {
        return `[object Flag key=${this._instruction.key}]`;
    }
}
