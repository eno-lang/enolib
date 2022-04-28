import { Element } from './element.js';
import { Embed } from './embed.js';
import { Field } from './field.js';
import { Flag } from './flag.js';
import { MissingEmbed} from './missing/missing_embed.js';
import { MissingField} from './missing/missing_field.js';
import { MissingFlag } from './missing/missing_flag.js';
import { MissingSectionElement } from './missing/missing_section_element.js';
import { MissingSection } from './missing/missing_section.js';

// TODO: touch() on ambiguous and/or missing elements
import { errors } from '../errors/validation.js';
import { ElementBase } from './element_base.js';

import {
    ID_TYPE_DOCUMENT,
    ID_TYPE_EMBED,
    ID_TYPE_FIELD,
    ID_TYPE_FLAG,
    ID_TYPE_SECTION
} from '../constants.js';

export class Section extends ElementBase {
    constructor(context, instruction, parent = null) {
        super(context, instruction, parent);
        
        this._allElementsRequired = parent ? parent._allElementsRequired : false;
    }
    
    get [Symbol.toStringTag]() {
        return 'Section';
    }
    
    _element(key, required = null) {
        this._touched = true;
        
        let elements;
        if (key === null) {
            elements = this._elements();
        } else {
            const elementsMap = this._elements(true);
            elements = elementsMap.hasOwnProperty(key) ? elementsMap[key] : [];
        }
        
        if (elements.length === 0) {
            if (required || required === null && this._allElementsRequired) {
                throw errors.missingElement(this._context, key, this._instruction, 'missingElement');
            } else if (required === null) {
                return new MissingSectionElement(key, this);
            } else {
                return null;
            }
        }
        
        if (elements.length > 1)
            throw errors.unexpectedMultipleElements(
                this._context,
                key,
                elements.map(element => element._instruction),
                'expectedSingleElement'
            );
        
        return elements[0];
    }
    
    _elements(map = false) {
        if (!this.hasOwnProperty('_instantiatedElements')) {
            this._instantiatedElementsMap = {};
            this._instantiatedElements = this._instruction.elements.map(element => {
                let instance;
                if (element.id & ID_TYPE_EMBED) {
                    instance = new Embed(this._context, element, this);
                } else if (element.id & ID_TYPE_FIELD) {
                    instance = new Field(this._context, element, this);
                } else if (element.id & ID_TYPE_FLAG) {
                    instance = new Flag(this._context, element, this);
                } else /* if (element.id & ID_TYPE_SECTION) */ {
                    instance = new Section(this._context, element, this);
                }
                
                if (this._instantiatedElementsMap.hasOwnProperty(element.key)) {
                    this._instantiatedElementsMap[element.key].push(instance);
                } else {
                    this._instantiatedElementsMap[element.key] = [instance];
                }
                
                return instance;
            });
        }
        
        return map ? this._instantiatedElementsMap : this._instantiatedElements;
    }
    
    _embed(key, required = null) {
        this._touched = true;
        
        let elements;
        if (key === null) {
            elements = this._elements();
        } else {
            const elementsMap = this._elements(true);
            elements = elementsMap.hasOwnProperty(key) ? elementsMap[key] : [];
        }
        
        if (elements.length === 0) {
            if (required || required === null && this._allElementsRequired) {
                throw errors.missingElement(this._context, key, this._instruction, 'missingEmbed');
            } else if (required === null) {
                return new MissingEmbed(key, this);
            } else {
                return null;
            }
        }
        
        if (elements.length > 1)
            throw errors.unexpectedMultipleElements(
                this._context,
                key,
                elements.map(element => element._instruction),
                'expectedSingleEmbed'
            );
        
        const element = elements[0];
        
        if (!(element._instruction.id & ID_TYPE_EMBED))
            throw errors.unexpectedElementType(this._context, key, element._instruction, 'expectedEmbed');
        
        return element;
    }
    
    _flag(key, required = null) {
        this._touched = true;
        
        let elements;
        if (key === null) {
            elements = this._elements();
        } else {
            const elementsMap = this._elements(true);
            elements = elementsMap.hasOwnProperty(key) ? elementsMap[key] : [];
        }
        
        if (elements.length === 0) {
            if (required || required === null && this._allElementsRequired) {
                throw errors.missingElement(this._context, key, this._instruction, 'missingFlag');
            } else if (required === null) {
                return new MissingFlag(key, this);
            } else {
                return null;
            }
        }
        
        if (elements.length > 1)
            throw errors.unexpectedMultipleElements(
                this._context,
                key,
                elements.map(element => element._instruction),
                'expectedSingleFlag'
            );
        
        const element = elements[0];
        
        if (!(element._instruction.id & ID_TYPE_FLAG))
            throw errors.unexpectedElementType(this._context, key, element._instruction, 'expectedFlag');
        
        return element;
    }
    
    _field(key, required = null) {
        this._touched = true;
        
        let elements;
        if (key === null) {
            elements = this._elements();
        } else {
            const elementsMap = this._elements(true);
            elements = elementsMap.hasOwnProperty(key) ? elementsMap[key] : [];
        }
        
        if (elements.length === 0) {
            if (required || required === null && this._allElementsRequired) {
                throw errors.missingElement(this._context, key, this._instruction, 'missingField');
            } else if (required === null) {
                return new MissingField(key, this);
            } else {
                return null;
            }
        }
        
        if (elements.length > 1)
            throw errors.unexpectedMultipleElements(
                this._context,
                key,
                elements.map(element => element._instruction),
                'expectedSingleField'
            );
        
        const element = elements[0];
        
        if (!(element._instruction.id & ID_TYPE_FIELD))
            throw errors.unexpectedElementType(this._context, key, element._instruction, 'expectedField');
            
        return element;
    }
    
    // TODO: Can probably be simplified again - e.g. pushed back into Missing* classes themselves - also check if MissingAttribute addition is made use of already
    _missingError(element) {
        if (element instanceof MissingEmbed) {
            throw errors.missingElement(this._context, element._key, this._instruction, 'missingEmbed');
        } else if (element instanceof MissingField) {
            throw errors.missingElement(this._context, element._key, this._instruction, 'missingField');
        } else if (element instanceof MissingFlag) {
            throw errors.missingElement(this._context, element._key, this._instruction, 'missingFlag');
        } else if (element instanceof MissingSection) {
            throw errors.missingElement(this._context, element._key, this._instruction, 'missingSection');
        } else {
            throw errors.missingElement(this._context, element._key, this._instruction, 'missingElement');
        }
    }
    
    _section(key, required = null) {
        this._touched = true;
        
        let elements;
        if (key === null) {
            elements = this._elements();
        } else {
            const elementsMap = this._elements(true);
            elements = elementsMap.hasOwnProperty(key) ? elementsMap[key] : [];
        }
        
        if (elements.length === 0) {
            if (required || required === null && this._allElementsRequired) {
                throw errors.missingElement(this._context, key, this._instruction, 'missingSection');
            } else if (required === null) {
                return new MissingSection(key, this);
            } else {
                return null;
            }
        }
        
        if (elements.length > 1)
            throw errors.unexpectedMultipleElements(
                this._context,
                key,
                elements.map(element => element._instruction),
                'expectedSingleSection'
            );
        
        const element = elements[0];
        
        if (!(element._instruction.id & ID_TYPE_SECTION))
            throw errors.unexpectedElementType(this._context, key, element._instruction, 'expectedSection');
        
        return element;
    }
    
    _untouched() {
        if (!this._touched)
            return this._instruction;
        
        for (const element of this._elements()) {
            const untouchedElement = element._untouched();
            
            if (untouchedElement) return untouchedElement;
        }
        
        return false;
    }
    
    allElementsRequired(required = true) {
        this._allElementsRequired = required;
        
        for (const element of this._elements()) {
            if (element._instruction.id & ID_TYPE_FIELD) {
                element.allAttributesRequired(required);
            } else if (element._instruction.id & ID_TYPE_SECTION) {
                element.allElementsRequired(required);
            }
        }
    }
    
    /**
    * Assert that all elements inside this section/document have been touched
    * @param {string} message A static string error message or a message function taking the excess element and returning an error string
    * @param {object} options
    * @param {array} options.except An array of element keys to exclude from assertion
    * @param {array} options.only Specifies to ignore all elements but the ones includes in this array of element keys
    */
    assertAllTouched(...optional) {
        let message = null;
        let options = {};
        
        for (const argument of optional) {
            if (typeof argument === 'object') {
                options = argument;
            } else {
                message = argument
            }
        }
        
        const elementsMap = this._elements(true);
        
        for (const [key, elements] of Object.entries(elementsMap)) {
            if (options.hasOwnProperty('except') && options.except.includes(key)) continue;
            if (options.hasOwnProperty('only') && !options.only.includes(key)) continue;
            
            for (const element of elements) {
                const untouched = element._untouched();
                
                if (untouched) {
                    if (typeof message === 'function') {
                        // TODO: Replace with instantiation of actual element type, then delete Element (?)
                        message = message(new Element(this._context, untouched, this));
                    }
                    
                    throw errors.unexpectedElement(this._context, message, untouched);
                }
            }
        }
    }
    
    element(key = null) {
        return this._element(key);
    }
    
    /**
    * Returns the elements of this {@link Section} as an array in the original document order.
    *
    * @param {string} [key] If provided only elements with the specified key are returned.
    * @return {Element[]} The elements of this {@link Section}.
    */
    elements(key = null) {
        this._touched = true;
        
        if (key === null) {
            return this._elements();
        } else {
            const elementsMap = this._elements(true);
            return elementsMap.hasOwnProperty(key) ? elementsMap[key] : [];
        }
    }
    
    // TODO: Here and in other implementations and in missing_section: flags(...) ?
    
    embed(key = null) {
        return this._embed(key);
    }
    
    embeds(key = null) {
        this._touched = true;
        
        let elements;
        if (key === null) {
            elements = this._elements();
        } else {
            const elementsMap = this._elements(true);
            elements = elementsMap.hasOwnProperty(key) ? elementsMap[key] : [];
        }
        
        return elements.map(element => {
            if (!(element._instruction.id & ID_TYPE_EMBED))
                throw errors.unexpectedElementType(this._context, key, element._instruction, 'expectedEmbeds');
                
            return element;
        });
    }
    
    field(key = null) {
        return this._field(key);
    }
    
    fields(key = null) {
        this._touched = true;
        
        let elements;
        if (key === null) {
            elements = this._elements();
        } else {
            const elementsMap = this._elements(true);
            elements = elementsMap.hasOwnProperty(key) ? elementsMap[key] : [];
        }
        
        return elements.map(element => {
            if (!(element._instruction.id & ID_TYPE_FIELD))
                throw errors.unexpectedElementType(this._context, key, element._instruction, 'expectedFields');
                
            return element;
        });
    }
    
    flag(key = null) {
        return this._flag(key);
    }
    
    flags(key = null) {
        this._touched = true;
        
        let elements;
        if (key === null) {
            elements = this._elements();
        } else {
            const elementsMap = this._elements(true);
            elements = elementsMap.hasOwnProperty(key) ? elementsMap[key] : [];
        }
        
        return elements.map(element => {
            if (!(element._instruction.id & ID_TYPE_FLAG))
                throw errors.unexpectedElementType(this._context, key, element._instruction, 'expectedFlags');
                
            return element;
        });
    }
    
    optionalElement(key = null) {
        return this._element(key, false);
    }
    
    optionalEmbed(key = null) {
        return this._embed(key, false);
    }
    
    optionalField(key = null) {
        return this._field(key, false);
    }
    
    optionalFlag(key = null) {
        return this._flag(key, false);
    }
    
    optionalSection(key = null) {
        return this._section(key, false);
    }
    
    /**
    * Returns the parent {@link Section} or null when called on the document.
    *
    * @return {?Section} The parent instance or null.
    */
    parent() {
        if (this._instruction.id & ID_TYPE_DOCUMENT)
            return null;
        
        return this._parent || new Section(this._context, this._instruction.parent);
    }
    
    requiredElement(key = null) {
        return this._element(key, true);
    }
    
    requiredEmbed(key = null) {
        return this._embed(key, true);
    }
    
    requiredField(key = null) {
        return this._field(key, true);
    }
    
    requiredFlag(key = null) {
        return this._flag(key, true);
    }
    
    requiredSection(key = null) {
        return this._section(key, true);
    }
    
    section(key = null) {
        return this._section(key);
    }
    
    sections(key = null) {
        this._touched = true;
        
        let elements;
        if (key === null) {
            elements = this._elements();
        } else {
            const elementsMap = this._elements(true);
            elements = elementsMap.hasOwnProperty(key) ? elementsMap[key] : [];
        }
        
        return elements.map(element => {
            if (!(element._instruction.id & ID_TYPE_SECTION))
                throw errors.unexpectedElementType(this._context, key, element._instruction, 'expectedSections');
            
            return element;
        });
    }
    
    /**
    * Returns a debug representation of this {@link Section} in the form of `[object Section key=foo elements=2]`, respectively `[object Section document elements=2]` for the document itself.
    *
    * @return {string} A debug representation of this {@link Section}.
    */
    toString() {
        if (this._instruction.id & ID_TYPE_DOCUMENT)
            return `[object Section document elements=${this._elements().length}]`;
        
        return `[object Section key=${this._instruction.key} elements=${this._elements().length}]`;
    }
    
    touch() {
        // TODO: Potentially revisit this - maybe we can do a shallow touch, that is: propagating only to the hierarchy below that was already instantiated,
        //       while marking the deepest initialized element as _touchedRecursive/Deeply or something, which marks a border for _untouched() checks that
        //       does not have to be traversed deeper down. However if after that the hierarchy is used after all, the _touched property should be picked
        //       up starting at the element marked _touchedRecursive, passing the property down below.
        
        this._touched = true;
        
        for (const element of this._elements()) {
            element.touch();
        }
    }
}