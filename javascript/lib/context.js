import { analyze } from './analyze.js';
import messages from './messages.js';
import { TextReporter } from './reporters/text_reporter.js';

import {
    ID_CONTAINS_CONTINUATIONS,
    ID_CONTAINS_VALUE,
    ID_TYPE_ATTRIBUTE,
    ID_TYPE_DOCUMENT,
    ID_TYPE_EMBED,
    ID_TYPE_FIELD,
    ID_TYPE_FLAG,
    ID_TYPE_ITEM,
    ID_TYPE_SECTION
} from './constants.js';

export class Context {
    constructor(input, options) {
        this._input = input;
        this.messages = options.hasOwnProperty('locale') ? options.locale : messages;
        this.reporter = options.hasOwnProperty('reporter') ? options.reporter : TextReporter;
        this.source = options.hasOwnProperty('source') ? options.source : null;

        this._analyze();
    }

    comment(element) {
        if (!element.hasOwnProperty('computedComment')) {
            if (element.hasOwnProperty('comments')) {
                if (element.comments.length === 1) {
                    element.computedComment = element.comments[0].comment;
                } else {
                    let firstNonEmptyLineIndex = null;
                    let sharedIndent = Infinity;
                    let lastNonEmptyLineIndex = null;
                    
                    for (const [index, comment] of element.comments.entries()) {
                        if (comment.hasOwnProperty('comment')) {
                            if (firstNonEmptyLineIndex === null) {
                                firstNonEmptyLineIndex = index;
                            }
                            
                            const indent = comment.ranges.comment[0] - comment.ranges.line[0];
                            if (indent < sharedIndent) {
                                sharedIndent = indent;
                            }
                            
                            lastNonEmptyLineIndex = index;
                        }
                    }
                    
                    if (firstNonEmptyLineIndex !== null) {
                        const nonEmptyLines = element.comments.slice(
                            firstNonEmptyLineIndex,
                            lastNonEmptyLineIndex + 1
                        );
                        
                        element.computedComment = nonEmptyLines.map(comment => {
                            if (!comment.hasOwnProperty('comment')) {
                                return '';
                            } else if (comment.ranges.comment[0] - comment.ranges.line[0] === sharedIndent) {
                                return comment.comment;
                            } else {
                                return ' '.repeat(comment.ranges.comment[0] - comment.ranges.line[0] - sharedIndent) + comment.comment;
                            }
                        }).join('\n');
                    } else {
                        element.computedComment = null;
                    }
                }
            } else {
                element.computedComment = null;
            }
        }
        
        return element.computedComment;
    }

    value(element) {
        if (!element.hasOwnProperty('computedValue')) {
            element.computedValue = null;
            
            if (element.id & ID_TYPE_EMBED) {
                if (element.lines.length > 0) {
                    element.computedValue = this._input.substring(
                        element.lines[0].ranges.line[0],
                        element.lines[element.lines.length - 1].ranges.line[1]
                    );
                }
            } else {
                if (element.hasOwnProperty('value')) {
                    element.computedValue = element.value;
                }
                
                if (element.id & ID_CONTAINS_CONTINUATIONS) {
                    let unappliedSpacing = false;
                    
                    for (const continuation of element.continuations) {
                        if (element.computedValue === null) {
                            if (continuation.hasOwnProperty('value')) {
                                element.computedValue = continuation.value;
                            }
                        } else if (continuation.hasOwnProperty('value')) {
                            if (unappliedSpacing) {
                                element.computedValue += ' ' + continuation.value;
                                unappliedSpacing = false;
                            } else if (continuation.spaced) {
                                element.computedValue += ' ' + continuation.value;
                            } else {
                                element.computedValue += continuation.value;
                            }
                        } else {
                            unappliedSpacing = unappliedSpacing || continuation.spaced;
                        }                        
                    }
                }
            }
        }
        
        return element.computedValue;
    }
}

Context.prototype._analyze = analyze;
