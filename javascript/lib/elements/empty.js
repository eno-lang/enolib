const { Element } = require('./element.js');

class Empty extends Element {
  get [Symbol.toStringTag]() {
    return 'Empty';
  }

  parent() {
    return this._parent || new Section(this._context, this._instruction.parent);
  }

  toString() {
    return `[object Empty key=${this._instruction.key}]`;
  }
}

exports.Empty = Empty;
