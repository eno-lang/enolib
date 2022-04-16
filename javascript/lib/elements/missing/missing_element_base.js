export class MissingElementBase {
    constructor(key, parent) {
        this._key = key;
        this._parent = parent;
    }
    
    _missingError(_element) {
        this._parent._missingError(this);
    }
    
    key(_loader) {
        this._parent._missingError(this);
    }
    
    optionalComment(_loader) {
        return null;
    }
    
    optionalStringComment() {
        return null;
    }
    
    requiredComment(_loader) {
        this._parent._missingError(this);
    }
    
    requiredStringComment() {
        this._parent._missingError(this);
    }
    
    stringKey() {
        this._parent._missingError(this);
    }
}
