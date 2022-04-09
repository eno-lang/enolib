import { Attribute } from './attribute.js';
import { ATTRIBUTE, DOCUMENT, ITEM } from  '../constants.js';
import { errors } from  '../errors/validation.js';
import { Item } from './item.js';
import { SectionElement } from  './section_element.js';

// TODO: parent() implementation on Element and SectionElement ?

export class Element extends SectionElement {
    toAttribute() {
        if(!this._attribute) {
            if (this._instruction.type !== ATTRIBUTE)
            throw errors.unexpectedElementType(this._context, null, this._instruction, 'expectedAttribute');
            
            this._attribute = new attribute_module.Attribute(this._context, this._instruction); // TODO: parent missing? or: what if casting Element to Field (inherited from SectionElement) but does not have parent because originating from lookup? investigate
        }
        
        return this._attribute;
    }
    
    toDocument() {
        if(this._instruction.type !== DOCUMENT)
        throw errors.unexpectedElementType(this._context, null, this._instruction, 'expectedDocument');
        
        if(!this._section) {
            this._section = new section_module.Section(this._context, this._instruction); // TODO: parent missing? or: what if casting Element to Field (inherited from SectionElement) but does not have parent because originating from lookup? investigate
            this._yielded = SECTION;
        }
        
        return this._section;
    }
    
    toItem() {
        if (!this._item) {
            if (this._instruction.type !== ITEM)
            throw errors.unexpectedElementType(this._context, null, this._instruction, 'expectedItem');
            
            this._item = new item_module.Item(this._context, this._instruction); // TODO: parent missing? or: what if casting Element to Field (inherited from SectionElement) but does not have parent because originating from lookup? investigate
        }
        
        return this._item;
    }
    
    toSection() {
        if(!this._section) {
            if(this._instruction.type !== SECTION && this._instruction.type !== DOCUMENT)
            throw errors.unexpectedElementType(this._context, null, this._instruction, 'expectedSection');
            
            this._section = new section_module.Section(this._context, this._instruction); // TODO: parent missing? or: what if casting Element to Field (inherited from SectionElement) but does not have parent because originating from lookup? investigate
            this._yielded = SECTION;
        }
        
        return this._section;
    }
    
    /**
    * Returns a debug representation of this {@link Element} in the form of `[object Element key=foo yields=field]`.
    *
    * @return {string} A debug representation of this {@link Element}.
    */
    toString() {
        return `[object Element key=${this._key()} yields=${this._yields()}]`;
    }
    
    yieldsDocument() {
        return this._instruction.type === DOCUMENT;
    }
    
    yieldsAttribute() {
        return this._instruction.type === ATTRIBUTE;
    }
    
    yieldsItem() {
        return this._instruction.type === ITEM;
    }
    
    yieldsSection() {
        return this._instruction.type === SECTION ||
        this._instruction.type === DOCUMENT;
    }
}
