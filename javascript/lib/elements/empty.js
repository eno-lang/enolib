const { ElementBase } = require('./element_base.js');

class Empty extends ElementBase {
  get [Symbol.toStringTag]() {
    return 'Empty';
  }

  parent() {
    return this._parent || new Section(this._context, this._instruction.parent);
  }

  /**
   * Returns a debug representation of this {@link Empty} in the form of `[object Empty key=foo]`.
   *
   * @return {string} A debug representation of this {@link Empty}.
   */
  toString() {
    return `[object Empty key=${this._instruction.key}]`;
  }
}

exports.Empty = Empty;
