import { MissingFlag } from './missing_flag.js';
import { MissingField } from './missing_field.js';
import { MissingSection } from './missing_section.js';

import { MissingElementBase } from './missing_element_base.js';

export class MissingSectionElement extends MissingElementBase {
    get [Symbol.toStringTag]() {
        return 'MissingSectionElement';
    }
    
    toField() {
        return new MissingField(this._key, this._parent);
    }
    
    toFlag() {
        return new MissingFlag(this._key, this._parent);
    }
    
    toSection() {
        return new MissingSection(this._key, this._parent);
    }
    
    toString() {
        if(this._key === null)
            return `[object MissingSectionElement]`;
        
        return `[object MissingSectionElement key=${this._key}]`;
    }
    
    yieldsField() {
        return true; // TODO: Throw instead?!
    }
    
    yieldsFlag() {
        return true; // TODO: Throw instead?!
    }
    
    yieldsSection() {
        return true; // TODO: Throw instead?!
    }
}
