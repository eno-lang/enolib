import { Section } from './section.js';
import { ValueElementBase } from './value_element_base.js';

export class Embed extends ValueElementBase {
    get [Symbol.toStringTag]() {
        return 'Embed';
    }
    
    // TODO: This could be implemented generically on whatever Embed inherits from in the end (here and elsewhere)
    /**
    * Returns the parent {@link Section}.
    *
    * @return {Section} The parent section.
    */
    parent() {
        return this._parent || new Section(this._context, this._instruction.parent);
    }
    
    /**
    * Returns a debug representation of this {@link Embed} in the form of `[object Embed key=foo value=bar]`
    *
    * @return {string} A debug representation of this {@link Embed}.
    */
    toString() {
        if (this._instruction.hasOwnProperty('continuations') || this._instruction.hasOwnProperty('value'))
            return `[object Embed key=${this._instruction.key} value=${this._printValue()}]`;
        
        return `[object Embed key=${this._instruction.key}]`;
    }
}
