import {
    ID_CONTAINS_ATTRIBUTES,
    ID_CONTAINS_CONTINUATIONS,
    ID_CONTAINS_ITEMS,
    ID_TYPE_ATTRIBUTE,
    ID_TYPE_DOCUMENT,
    ID_TYPE_EMBED,
    ID_TYPE_FIELD,
    ID_TYPE_ITEM,
    ID_TYPE_SECTION
} from '../constants.js';

// TODO: Better simple lastIn() / lastMissingIn() utility function usage to get m...n range for tagging?

export const DISPLAY = Symbol('Display Line');
export const EMPHASIZE = Symbol('Emphasize Line');
export const INDICATE = Symbol('Indicate Line');
export const OMISSION = Symbol('Insert Omission');
export const QUESTION = Symbol('Question Line');

export class Reporter {
    constructor(context) {
        this._context = context;
        this._index = new Array(this._context._lineCount);
        this._snippet = new Array(this._context._lineCount);
        
        this._buildIndex()
    }
    
    _buildIndex() {
        const indexComments = element => {
            if (element.hasOwnProperty('comments')) {
                for (const comment of element.comments) {
                    this._index[comment.line] = comment;
                }
            }
        };
        
        const traverse = section => {
            for (const element of section.elements) {
                indexComments(element);
                
                this._index[element.line] = element;
                
                if (element.id & ID_TYPE_SECTION) {
                    traverse(element);
                } else if (element.id & ID_TYPE_FIELD) {
                    if (element.id & ID_CONTAINS_ITEMS) {
                        for (const item of element.items) {
                            indexComments(item);
                            
                            this._index[item.line] = item;
                            
                            if (item.id & ID_CONTAINS_CONTINUATIONS) {
                                for (const continuation of item.continuations) {
                                    this._index[continuation.line] = continuation;
                                }
                            }
                        }
                    } else if (element.id & ID_CONTAINS_ATTRIBUTES) {
                        for (const attribute of element.attributes) {
                            indexComments(attribute);
                            
                            this._index[attribute.line] = attribute;
                            
                            if (attribute.id & ID_CONTAINS_CONTINUATIONS) {
                                for (const continuation of attribute.continuations) {
                                    this._index[continuation.line] = continuation;
                                }
                            }
                        }
                    } else if (element.id & ID_CONTAINS_CONTINUATIONS) {
                        for (const continuation of element.continuations) {
                            this._index[continuation.line] = continuation;
                        }
                    }
                } else if (element.id & ID_TYPE_EMBED) {
                    // Missing when reporting an unterminated embed
                    if (element.hasOwnProperty('end')) {
                        this._index[element.end.line] = element.end;
                    }
                    
                    for (const line of element.lines) {
                        this._index[line.line] = line;
                    }
                }
            }
        }
        
        traverse(this._context._document);
        
        for (const meta of this._context._meta) {
            this._index[meta.line] = meta;
        }
    }
    
    _tagContinuations(element, tag) {
        let scanLine = element.line + 1;
        
        if (!(element.id & ID_CONTAINS_CONTINUATIONS))
            return scanLine;
        
        for (const continuation of element.continuations) {
            while (scanLine < continuation.line) {
                this._snippet[scanLine] = tag;
                scanLine++;
            }
            
            this._snippet[continuation.line] = tag;
            scanLine++;
        }
        
        return scanLine;
    }
    
    _tagContinuables(element, collection, tag) {
        let scanLine = element.line + 1;
        
        if (element[collection].length === 0)
        return scanLine;
        
        for (const continuable of element[collection]) {
            while (scanLine < continuable.line) {
                this._snippet[scanLine] = tag;
                scanLine++;
            }
            
            this._snippet[continuable.line] = tag;
            
            scanLine = this._tagContinuations(continuable, tag);
        }
        
        return scanLine;
    }
    
    _tagChildren(element, tag) {
        if (element.id & ID_TYPE_FIELD) {
            if (element.id & ID_CONTAINS_ITEMS) {
                return this._tagContinuables(element, 'items', tag);
            } else if (element.id & ID_CONTAINS_ATTRIBUTES) {
                return this._tagContinuables(element, 'attributes', tag);
            } else {
                return this._tagContinuations(element, tag);
            }
        } else if (element.id & (ID_TYPE_ATTRIBUTE | ID_TYPE_ITEM)) {
            return this._tagContinuations(element, tag);
        } else if (element.id & ID_TYPE_EMBED) {
            for (const line of element.lines) {
                this._snippet[line.line] = tag;
            }
            
            if (element.hasOwnProperty('end')) {
                this._snippet[element.end.line] = tag;
                return element.end.line + 1;
            } else if (element.lines.length > 0) {
                return element.lines[element.lines.length - 1].line + 1;
            } else {
                return element.line + 1;
            }
        } else if (element.id & ID_TYPE_SECTION) {
            return this._tagSection(element, tag);
        }
    }
    
    _tagSection(section, tag, recursive = true) {
        let scanLine = section.line + 1;
        
        for (const element of section.elements) {
            while (scanLine < element.line) {
                this._snippet[scanLine] = tag;
                scanLine++;
            }
            
            if (!recursive && element.id & ID_TYPE_SECTION) break;
            
            this._snippet[element.line] = tag;
            
            scanLine = this._tagChildren(element, tag);
        }
        
        return scanLine;
    }
    
    indicateElement(element) {
        this._snippet[element.line] = INDICATE;
        this._tagChildren(element, INDICATE);
        
        return this;
    }
    
    indicateLine(element) {
        this._snippet[element.line] = INDICATE;
        return this;
    }
    
    questionLine(element) {
        this._snippet[element.line] = QUESTION;
        return this;
    }
    
    reportComments(element) {
        this._snippet[element.line] = INDICATE;
        for (const comment of element.comments) {
            this._snippet[comment.line] = EMPHASIZE;
        }
        
        return this;
    }
    
    reportElement(element) {
        this._snippet[element.line] = EMPHASIZE;
        this._tagChildren(element, INDICATE);
        
        return this;
    }
    
    reportElements(elements) {
        for (const element of elements) {
            this._snippet[element.line] = EMPHASIZE;
            this._tagChildren(element, INDICATE);
        }
        
        return this;
    }
    
    reportEmbedValue(element) {
        for (const line of element.lines) {
            this._snippet[line.line] = EMPHASIZE;
        }
        
        return this;
    }
    
    reportLine(instruction) {
        this._snippet[instruction.line] = EMPHASIZE;
        
        return this;
    }
    
    reportMissingElement(parent) {
        if (!(parent.id & ID_TYPE_DOCUMENT)) {
            this._snippet[parent.line] = INDICATE;
        }
        
        if (parent.id & ID_TYPE_SECTION) {
            this._tagSection(parent, QUESTION, false);
        } else {
            this._tagChildren(parent, QUESTION);
        }
        
        return this;
    }
    
    snippet() {
        if (this._snippet.every(line => line === undefined)) {
            for (let line = 0; line < this._snippet.length; line++) {
                this._snippet[line] = QUESTION;
            }
        } else {
            // TODO: Possibly better algorithm for this
            
            for (const [line, tag] of this._snippet.entries()) {
                if (tag !== undefined) continue;
                
                // TODO: Prevent out of bounds access
                if (this._snippet[line + 2] !== undefined && this._snippet[line + 2] !== DISPLAY ||
                    this._snippet[line - 2] !== undefined && this._snippet[line - 2] !== DISPLAY ||
                    this._snippet[line + 1] !== undefined && this._snippet[line + 1] !== DISPLAY ||
                    this._snippet[line - 1] !== undefined && this._snippet[line - 1] !== DISPLAY) {
                    this._snippet[line] = DISPLAY;
                } else if (this._snippet[line + 3] !== undefined && this._snippet[line + 3] !== DISPLAY) {
                    this._snippet[line] = OMISSION;
                }
            }
            
            if (this._snippet[this._snippet.length - 1] === undefined) {
                this._snippet[this._snippet.length - 1] = OMISSION;
            }
        }
        
        return this._print();
    }
}
