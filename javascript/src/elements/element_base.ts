import { errors } from '../errors/validation.js';
import {
    DOCUMENT,
    EMBED_BEGIN,
    FIELD,
    FLAG,
    ITEM,
    SECTION
} from '../constants.js';

export class ElementBase {
    constructor(context, instruction, parent = null) {
        this._context = context;
        this._instruction = instruction;
        this._parent = parent;
    }
    
    _comment(loader, required) {
        this._touched = true;
        
        const comment = this._context.comment(this._instruction);
        
        if(comment === null) {
            if(required)
                throw errors.missingComment(this._context, this._instruction);
            
            return null;
        }
        
        if(loader === null)
        return comment;
        
        try {
            return loader(comment);
        } catch (message) {
            throw errors.commentError(this._context, message, this._instruction);
        }
    }
    
    _key() {
        switch (this._instruction.type) {
            case DOCUMENT: return null;
            case ITEM: return this._instruction.parent.key;
            default: return this._instruction.key;
        }
    }
    
    /**
    * Constructs and returns a {@link ValidationError} with the supplied message in the context of this element's comment.
    *
    * Note that this only *returns* an error, whether you want to just use its
    * metadata, pass it on or actually throw the error is up to you.
    *
    * @param {string|function(comment: string): string} message A message or a function that receives the element's comment and returns the message.
    * @return {ValidationError} The requested error.
    */
    commentError(message) {
        return errors.commentError(
            this._context,
            typeof message === 'function' ? message(this._context.comment(this._instruction)) : message,
            this._instruction
        );
    }
    
    /**
    * Constructs and returns a {@link ValidationError} with the supplied message in the context of this element.
    *
    * Note that this only *returns* an error, whether you want to just use its
    * metadata, pass it on or actually throw the error is up to you.
    *
    * @param {string|function(element: Element): string} message A message or a function that receives the element and returns the message.
    * @return {ValidationError} The requested error.
    */
    error(message) {
        return errors.elementError(
            this._context,
            typeof message === 'function' ? message(this) : message,  // TODO: *this* is problematic in this context - what is it?
            this._instruction
        );
    }
    
    /**
    * Check whether the element has attributes (and therefore, implicitly, also whether it's a field).
    *
    * @return {bool} Whether the element has attributes.
    */
    hasAttributes() {
        return this._instruction.hasOwnProperty('attributes');
    }
    
    /**
    * Check whether the element has items (and therefore, implicitly, also whether it's a field).
    *
    * @return {bool} Whether the element has items.
    */
    hasItems() {
        return this._instruction.hasOwnProperty('items');
    }
    
    /**
    * Check whether the element has a value (and therefore, implicitly, also whether it's a field or an embed).
    *
    * @return {bool} Whether the element has a value.
    */
    hasValue() {
        // TODO: Not fully correct actually, it could have empty continuations only, which is not entirely a value.
        return this._instruction.hasOwnProperty('continuations') || this._instruction.hasOwnProperty('value');
    }
    
    isEmbed() {
        return this._instruction.type === EMBED_BEGIN;
    }
    
    isFlag() {
        return this._instruction.type === FLAG;
    }
    
    isField() {
        return this._instruction.type === FIELD;
    }
    
    isSection() {
        return this._instruction.type === SECTION;
    }
    
    /**
    * Passes the key of this {@link Element} through the provided loader, returns the result and touches the element.
    * Throws a {@link ValidationError} if an error is intercepted from the loader.
    *
    * @example
    * // Given a field with the key 'foo' ...
    *
    * field.key(key => key.toUpperCase()); // returns 'FOO'
    * field.key(key => { throw 'You shall not pass!'; }); // throws an error based on the intercepted error message
    *
    * @param {function(key: string): any} loader A loader function taking the key as a `string` and returning any other type or throwing a `string` message.
    * @return {any} The result of applying the provided loader to this {@link Element}'s key.
    * @throws {ValidationError} Thrown when an error from the loader is intercepted.
    */
    key(loader) {
        this._touched = true;
        
        try {
            return loader(this._key());
        } catch (message) {
            throw errors.keyError(this._context, message, this._instruction);
        }
    }
    
    /**
    * Constructs and returns a {@link ValidationError} with the supplied message in the context of this element's key.
    *
    * Note that this only *returns* an error, whether you want to just use its
    * metadata, pass it on or actually throw the error is up to you.
    *
    * @param {string|function(key: string): string} message A message or a function that receives the element's key and returns the message.
    * @return {ValidationError} The requested error.
    */
    keyError(message) {
        return errors.keyError(
            this._context,
            typeof message === 'function' ? message(this._key()) : message,
            this._instruction
        );
    }
    
    /**
    * Passes the associated comment of this {@link Element} through the provided loader, returns the result and touches the element.
    * The loader is only invoked if there is an associated comment, otherwise `null` is returned directly.
    * Throws a {@link ValidationError} if an error is intercepted from the loader.
    *
    * @example
    * // Given a field with an associated comment 'foo' ...
    *
    * field.optionalComment(comment => comment.toUpperCase()); // returns 'FOO'
    * field.optionalComment(comment => { throw 'You shall not pass!'; }); // throws an error based on the intercepted error message
    *
    * // Given a field with no associated comment ...
    *
    * field.optionalComment(comment => comment.toUpperCase()); // returns null
    * field.optionalComment(comment => { throw 'You shall not pass!'; }); // returns null
    *
    * @param {function(value: string): any} loader A loader function taking the comment as `string` and returning any other type or throwing a `string` message.
    * @return {?any} The result of applying the provided loader to this {@link Element}'s comment, or `null` when none exists.
    * @throws {ValidationError} Thrown when an error from the loader is intercepted.
    */
    optionalComment(loader) {
        return this._comment(loader, false);
    }
    
    /**
    * Returns the associated comment of this {@link Element} as a `string` and touches the element.
    * Returns `null` if there is no associated comment.
    *
    * @return {?string} The associated comment of this {@link Element} as a `string`, or `null`.
    */
    optionalStringComment() {
        return this._comment(null, false);
    }
    
    /**
    * Passes the associated comment of this {@link Element} through the provided loader, returns the result and touches the element.
    * The loader is only invoked if there is an associated comment, otherwise a {@link ValidationError} is thrown directly.
    * Also throws a {@link ValidationError} if an error is intercepted from the loader.
    *
    * @example
    * // Given a field with an associated comment 'foo' ...
    *
    * field.requiredComment(comment => comment.toUpperCase()); // returns 'FOO'
    * field.requiredComment(comment => { throw 'You shall not pass!'; }); // throws an error based on the intercepted error message
    *
    * // Given a field with no associated comment ...
    *
    * field.requiredComment(comment => comment.toUpperCase()); // throws an error stating that a required comment is missing
    * field.requiredComment(comment => { throw 'You shall not pass!'; }); // throws an error stating that a required comment is missing
    *
    * @param {function(value: string): any} loader A loader function taking the comment as `string` and returning any other type or throwing a `string` message.
    * @return {any} The result of applying the provided loader to this {@link Element}'s comment.
    * @throws {ValidationError} Thrown when there is no associated comment or an error from the loader is intercepted.
    */
    requiredComment(loader) {
        return this._comment(loader, true);
    }
    
    /**
    * Returns the associated comment of this {@link Element} as a `string` and touches the element.
    * Throws a {@link ValidationError} if there is no associated comment.
    *
    * @return {string} The associated comment of this {@link Element} as a `string`.
    * @throws {ValidationError} Thrown when there is no associated comment.
    */
    requiredStringComment() {
        return this._comment(null, true);
    }
    
    /**
    * Returns the key of this {@link Element} as a `string` and touches the element.
    *
    * @return {string} The key of this {@link Element} as a `string`.
    */
    stringKey() {
        this._touched = true;
        
        return this._key();
    }
    
    /**
    * Touches this {@link Element} and all elements below it.
    */
    touch() {
        this._touched = true;
    }
}