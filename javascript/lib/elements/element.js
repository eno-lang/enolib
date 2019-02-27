const { errors } = require('../errors/validation.js');

class Element {
  constructor(context, instruction) {
    this._context = context;
    this._instruction = instruction;
    this._touched = false;
  }

  _comment(loader, required) {
    this._touched = true;

    const comment = this._lazyComment();

    if(comment === null) {
      if(required)
        throw errors.missingComment(this._context, this._instruction);

      return null;
    }

    if(loader === null)
      return comment;

    try {
      return loader(comment);
    } catch(message) {
      throw errors.commentError(this._context, message, this._instruction);
    }
  }

  _lazyComment() {
    if(!this.hasOwnProperty('_cachedComment')) {
      if(this._instruction.hasOwnProperty('comments')) {
        if(this._instruction.comments.length === 1) {
          this._cachedComment = this._instruction.comments[0].value;
        } else {
          let firstNonEmptyLineIndex = null;
          let sharedIndent = Infinity;
          let lastNonEmptyLineIndex = null;

          for(const [index, comment] of this._instruction.comments.entries()) {
            if(comment.value !== null) {
              if(firstNonEmptyLineIndex == null) {
                firstNonEmptyLineIndex = index;
              }

              const indent = comment.ranges.value[0] - comment.ranges.line[0];
              if(comment.ranges.value[0] - comment.ranges.line[0] < sharedIndent) {
                sharedIndent = comment.ranges.value[0] - comment.ranges.line[0];
              }

              lastNonEmptyLineIndex = index;
            }
          }

          if(firstNonEmptyLineIndex !== null) {
            const nonEmptyLines = this._instruction.comments.slice(
              firstNonEmptyLineIndex,
              lastNonEmptyLineIndex + 1
            );

            this._cachedComment = nonEmptyLines.map(comment => {
              if(comment.value === null) {
                return '';
              } else if(comment.ranges.value[0] - comment.ranges.line[0] === sharedIndent) {
                return comment.value;
              } else {
                return ' '.repeat(comment.ranges.value[0] - comment.ranges.line[0] - sharedIndent) + comment.value;
              }
            }).join('\n');
          } else {
            this._cachedComment = null;
          }
        }
      } else {
        this._cachedComment = null;
      }
    }

    return this._cachedComment;
  }

  commentError(message) {
    return errors.commentError(
      this._context,
      typeof message === 'function' ? message(this._lazyComment()) : message,
      this._instruction
    );
  }

  error(message) {
    return errors.elementError(
      this._context,
      typeof message === 'function' ? message(this) : message,
      this._instruction
    );
  }

  optionalComment(loader) {
    return this._comment(loader, false);
  }

  optionalStringComment() {
    return this._comment(null, false);
  }

  requiredComment(loader) {
    return this._comment(loader, true);
  }

  requiredStringComment() {
    return this._comment(null, true);
  }
}

exports.Element = Element;
