import { MissingFlag } from './missing_flag.js';
import { MissingField } from './missing_field.js';
import { MissingSection } from './missing_section.js';

import { MissingElementBase } from './missing_element_base.js';

export class MissingSectionElement extends MissingElementBase {
    get [Symbol.toStringTag]() {
        return 'MissingSectionElement';
    }
    
    toString() {
        if(this._key === null)
            return `[object MissingSectionElement]`;
        
        return `[object MissingSectionElement key=${this._key}]`;
    }
}
