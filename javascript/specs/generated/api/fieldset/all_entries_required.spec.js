const enolib = require('../../../..');

describe('Querying a missing entry on a fieldset when all entries are required', () => {
  it('throws the expected ValidationError', () => {
    let error = null;

    const input = `fieldset:`;

    try {
      const fieldset = enolib.parse(input).fieldset('fieldset');
      
      fieldset.allEntriesRequired();
      fieldset.entry('entry');
    } catch(_error) {
      if(_error instanceof enolib.ValidationError) {
        error = _error;
      } else {
        throw _error;
      }
    }

    expect(error).toBeInstanceOf(enolib.ValidationError);
    
    const text = `The fieldset entry 'entry' is missing - in case it has been specified look for typos and also check for correct capitalization.`;
    
    expect(error.text).toEqual(text);
  });
});

describe('Querying a missing entry on a fieldset when all requiring all entries is explicitly enabled', () => {
  it('throws the expected ValidationError', () => {
    let error = null;

    const input = `fieldset:`;

    try {
      const fieldset = enolib.parse(input).fieldset('fieldset');
      
      fieldset.allEntriesRequired(true);
      fieldset.entry('entry');
    } catch(_error) {
      if(_error instanceof enolib.ValidationError) {
        error = _error;
      } else {
        throw _error;
      }
    }

    expect(error).toBeInstanceOf(enolib.ValidationError);
    
    const text = `The fieldset entry 'entry' is missing - in case it has been specified look for typos and also check for correct capitalization.`;
    
    expect(error.text).toEqual(text);
  });
});

describe('Querying a missing entry on a fieldset when requiring all entries is explicitly disabled', () => {
  it('produces the expected result', () => {
    const input = `fieldset:`;

    const fieldset = enolib.parse(input).fieldset('fieldset');
    
    fieldset.allEntriesRequired(false);
    fieldset.entry('entry');

    expect('it passes').toBeTruthy();
  });
});

describe('Querying a missing entry on a fieldset when requiring all entries is enabled and disabled again', () => {
  it('produces the expected result', () => {
    const input = `fieldset:`;

    const fieldset = enolib.parse(input).fieldset('fieldset');
    
    fieldset.allEntriesRequired(true);
    fieldset.allEntriesRequired(false);
    fieldset.entry('entry');

    expect('it passes').toBeTruthy();
  });
});