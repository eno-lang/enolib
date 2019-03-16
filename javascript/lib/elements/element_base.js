const { errors } = require('../errors/validation.js');
const { LIST_ITEM } = require('../constants.js');

class ElementBase {
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
    } catch(message) {
      throw errors.commentError(this._context, message, this._instruction);
    }
  }

  _key() {
    return this._instruction.type === LIST_ITEM ? this._instruction.parent.key : this._instruction.key;
  }

  commentError(message) {
    return errors.commentError(
      this._context,
      typeof message === 'function' ? message(this._context.comment(this._instruction)) : message,
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

  key(loader) {
    this._touched = true;

    try {
      return loader(this._key());
    } catch(message) {
      throw errors.keyError(this._context, message, this._instruction);
    }
  }

  keyError(message) {
    return errors.keyError(
      this._context,
      typeof message === 'function' ? message(this._key()) : message,
      this._instruction
    );
  }

  optionalComment(loader) {
    return this._comment(loader, false);
  }

  optionalStringComment() {
    return this._comment(null, false);
  }

  raw() {
    return this._context.raw(this._instruction);
  }

  requiredComment(loader) {
    return this._comment(loader, true);
  }

  requiredStringComment() {
    return this._comment(null, true);
  }

  stringKey() {
    this._touched = true;

    return this._key();
  }

  touch() {
    this._touched = true;
  }
}

exports.ElementBase = ElementBase;
