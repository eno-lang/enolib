const { EnoError, ParseError, ValidationError } = require('../lib/error_types.js');

const text = 'My error';
const snippet = 'My snippet';
const selection = {
  from: {
    column: 2,
    line: 1,
    index: 3
  },
  to: {
    column: 4,
    line: 5,
    index: 6
  },
};
const cursor = selection.from;

for(let _class of [EnoError, ParseError, ValidationError]) {

  describe(_class.name, () => {
    const error = new _class(text, snippet, selection);

    it('returns the expected message', () => {
      expect(error.message).toMatchSnapshot();
    });

    it('returns the expected text', () => {
      expect(error.text).toEqual(text);
    });

    it('returns the expected snippet', () => {
      expect(error.snippet).toEqual(snippet);
    });

    it('returns the expected selection range', () => {
      expect(error.selection).toEqual(selection);
    });

    it('returns the expected cursor location', () => {
      expect(error.cursor).toEqual(cursor);
    });

    if(_class !== EnoError) {
      it('is generically catchable as an EnoError when thrown', () => {
        const throwAndCatch = () => {
          try {
            throw error;
          } catch(err) {
            if(err instanceof EnoError) {
              // Expected to land here
            } else {
              throw err;
            }
          }
        };

        expect(throwAndCatch).not.toThrow();
      });
    }

  });

}
