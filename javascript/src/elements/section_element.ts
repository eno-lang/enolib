import { ElementBase } from './element_base.js';
import { Flag } from './flag.js';
import { errors } from '../errors/validation.js';
import { Field } from './field.js';
import { Section } from './section.js';

import {
    EMBED_BEGIN,
    FIELD,
    FLAG,
    PRETTY_TYPES,
    SECTION
} from '../constants.js';

// TODO: If this SectionElement gets touched (this._touched = true;),
//       the touched flag needs to be propagated down the hierarchy
//       when toSomething() is called to typecast the SectionElement.
//       I.e. the constructors for Field/Fieldset/etc. need to accept
//       this extra init parameter probably and it has to be passed
//       on lazily all the way down to the terminal leaves of the tree.
//       (applies to all implementations)

export class SectionElement extends ElementBase {
    _untouched() {
        if (!this.hasOwnProperty('_yielded') && !this.hasOwnProperty('_touched'))
            return this._instruction;
        if (this.hasOwnProperty('_flag') && !this._flag.hasOwnProperty('_touched'))
            return this._instruction;
        if (this.hasOwnProperty('_field') && !this._field.hasOwnProperty('_touched'))
            return this._instruction;
        if (this.hasOwnProperty('_section'))
            return this._section._untouched();
    }
        
    /**
    * Returns a debug representation of this {@link SectionElement} in the form of `[object SectionElement key=foo yields=field]`.
    *
    * @return {string} A debug representation of this {@link SectionElement}.
    */
    toString() {
        return `[object SectionElement key=${this._key()} yields=${this._yields()}]`;
    }
    
    touch() {
        if (!this.hasOwnProperty('_yielded')) {
            this._touched = true;
        } else if (this.hasOwnProperty('_flag')) {
            this._flag._touched = true;
        } else if (this.hasOwnProperty('_field')) {
            this._field.touch();
        } else if (this.hasOwnProperty('_section')) {
            this._section.touch();
        }
    }
}
