import { MissingFlag } from './missing_flag.js';
import { MissingField } from './missing_field.js';
import { MissingSectionElement } from './missing_section_element.js';

import { MissingElementBase } from './missing_element_base.js';

export class MissingSection extends MissingElementBase {
    get [Symbol.toStringTag]() {
        return 'MissingSection';
    }
    
    flag(key = null) {
        return new MissingFlag(key, this);
    }
    
    element(key = null) {
        return new MissingSectionElement(key, this);
    }
    
    elements(_key = null) {
        return [];
    }
    
    field(key = null) {
        return new MissingField(key, this);
    }
    
    fields(_key = null) {
        return [];
    }
    
    optionalElement(_key = null) {
        return null;
    }
    
    optionalField(_key = null) {
        return null;
    }
    
    optionalFlag(_key = null) {
        return null;
    }
    
    optionalSection(_key = null) {
        return null;
    }
    
    requiredElement(_key = null) {
        this._parent._missingError(this);
    }
    
    requiredField(_key = null) {
        this._parent._missingError(this);
    }
    
    requiredFlag(_key = null) {
        this._parent._missingError(this);
    }
    
    requiredSection(_key = null) {
        this._parent._missingError(this);
    }
    
    section(key = null) {
        return new MissingSection(key, this);
    }
    
    sections(_key = null) {
        return [];
    }
    
    toString() {
        if(this._key === null)
            return `[object MissingSection]`;
        
        return `[object MissingSection key=${this._key}]`;
    }
}