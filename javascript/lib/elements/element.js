import { ElementBase } from  './element_base.js';

// TODO: parent() implementation on Element ?

export class Element extends ElementBase {
    /**
    * Returns a debug representation of this {@link Element} in the form of `[object Element key=foo yields=field]`.
    *
    * @return {string} A debug representation of this {@link Element}.
    */
    toString() {
        return `[object Element key=${this._key()}]`;
    }
}
