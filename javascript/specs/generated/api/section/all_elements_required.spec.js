const enolib = require('../../../..');

describe('Querying a missing field on the document when all elements are required', () => {
  it('throws the expected ValidationError', () => {
    let error = null;

    const input = ``;

    try {
      const document = enolib.parse(input);
      
      document.allElementsRequired();
      document.field('field');
    } catch(_error) {
      if(_error instanceof enolib.ValidationError) {
        error = _error;
      } else {
        throw _error;
      }
    };

    expect(error).toBeInstanceOf(enolib.ValidationError);
    
    const text = `The field 'field' is missing - in case it has been specified look for typos and also check for correct capitalization.`;
    
    expect(error.text).toEqual(text);
  });
});

describe('Querying a missing fieldset on the document when all elements are required', () => {
  it('throws the expected ValidationError', () => {
    let error = null;

    const input = ``;

    try {
      const document = enolib.parse(input);
      
      document.allElementsRequired();
      document.fieldset('fieldset');
    } catch(_error) {
      if(_error instanceof enolib.ValidationError) {
        error = _error;
      } else {
        throw _error;
      }
    };

    expect(error).toBeInstanceOf(enolib.ValidationError);
    
    const text = `The fieldset 'fieldset' is missing - in case it has been specified look for typos and also check for correct capitalization.`;
    
    expect(error.text).toEqual(text);
  });
});

describe('Querying a missing list on the document when all elements are required', () => {
  it('throws the expected ValidationError', () => {
    let error = null;

    const input = ``;

    try {
      const document = enolib.parse(input);
      
      document.allElementsRequired();
      document.list('list');
    } catch(_error) {
      if(_error instanceof enolib.ValidationError) {
        error = _error;
      } else {
        throw _error;
      }
    };

    expect(error).toBeInstanceOf(enolib.ValidationError);
    
    const text = `The list 'list' is missing - in case it has been specified look for typos and also check for correct capitalization.`;
    
    expect(error.text).toEqual(text);
  });
});

describe('Querying a missing section on the document when all elements are required', () => {
  it('throws the expected ValidationError', () => {
    let error = null;

    const input = ``;

    try {
      const document = enolib.parse(input);
      
      document.allElementsRequired();
      document.section('section');
    } catch(_error) {
      if(_error instanceof enolib.ValidationError) {
        error = _error;
      } else {
        throw _error;
      }
    };

    expect(error).toBeInstanceOf(enolib.ValidationError);
    
    const text = `The section 'section' is missing - in case it has been specified look for typos and also check for correct capitalization.`;
    
    expect(error.text).toEqual(text);
  });
});

describe('Querying a missing field on the document when requiring all elements is explicitly disabled', () => {
  it('produces the expected result', () => {
    const input = ``;

    const document = enolib.parse(input);
    
    document.allElementsRequired(false);
    document.field('field');

    expect('it passes').toBeTruthy();
  });
});

describe('Querying a missing field on the document when requiring all elements is enabled and disabled again', () => {
  it('produces the expected result', () => {
    const input = ``;

    const document = enolib.parse(input);
    
    document.allElementsRequired(true);
    document.allElementsRequired(false);
    document.field('field');

    expect('it passes').toBeTruthy();
  });
});