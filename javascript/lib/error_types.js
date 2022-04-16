export class EnoError extends Error {
    constructor(text, snippet, selection) {
        super(`${text}\n\n${snippet}`);
        
        this.selection = selection;
        this.snippet = snippet;
        this.text = text;
        
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, EnoError);
        }
    }
    
    get cursor() {
        return this.selection.from;
    }
}

export class ParseError extends EnoError {
    constructor(...args) {
        super(...args);
        
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ParseError);
        }
    }
}

export class ValidationError extends EnoError {
    constructor(...args) {
        super(...args);
        
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ValidationError);
        }
    }
}
