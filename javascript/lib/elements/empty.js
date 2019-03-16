const { ElementBase } = require('./element_base.js');

class Empty extends ElementBase {
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
