const { EnoError, ParseError, ValidationError } = require('./lib/error_types.js');
const { toMatchSnapshot } = require('jest-snapshot');

// TODO: Revisit if still needed

expect.addSnapshotSerializer({
  print: (error, serialize, indent) => `
type: ${error.constructor.name}
text: ${error.text}

-- snippet
${error.snippet}
-- snippet

cursor: [${error.cursor}]
selection: [${error.selection[0]}] => [${error.selection[1]}]
  `.trim(),
  test: value => value instanceof EnoError
});

expect.extend({
  toThrowParseErrorMatchingSnapshot(callback) {
    try {
      callback();
    } catch(error) {
      if(error instanceof ParseError) {
        return toMatchSnapshot.call(this, error);
      } else {
        throw error;
      }
    }
  },
  toThrowValidationErrorMatchingSnapshot(callback) {
    try {
      callback();
    } catch(error) {
      if(error instanceof ValidationError) {
        return toMatchSnapshot.call(this, error);
      } else {
        throw error;
      }
    }
  }
});
