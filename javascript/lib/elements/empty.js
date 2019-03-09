const { Element } = require('./element.js');

class Empty extends Element {
  constructor(context, instruction) {
    super(context, instruction);

    this._instruction.instance = this;
  }

  get [Symbol.toStringTag]() {
    return 'Empty';
  }

  parent() {
    return this._instruction.parent.instance || new Section(this._context, this._instruction.parent);
  }

  toString() {
    return `[object Empty key=${this._instruction.key}]`;
  }
}

exports.Empty = Empty;
