<?php declare(strict_types=1);

describe('Querying a missing entry on a fieldset when all entries are required', function() {
  it('throws the expected ValidationError', function() {
    $error = null;

    $input = "fieldset:";

    try {
      $fieldset = Enolib\Parser::parse($input)->fieldset('fieldset');
      
      $fieldset->allEntriesRequired();
      $fieldset->entry('entry');
    } catch(Enolib\ValidationError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
    
    $text = "The fieldset entry 'entry' is missing - in case it has been specified look for typos and also check for correct capitalization.";
    
    expect($error->text)->toEqual($text);
  });
});

describe('Querying a missing entry on a fieldset when all requiring all entries is explicitly enabled', function() {
  it('throws the expected ValidationError', function() {
    $error = null;

    $input = "fieldset:";

    try {
      $fieldset = Enolib\Parser::parse($input)->fieldset('fieldset');
      
      $fieldset->allEntriesRequired(true);
      $fieldset->entry('entry');
    } catch(Enolib\ValidationError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
    
    $text = "The fieldset entry 'entry' is missing - in case it has been specified look for typos and also check for correct capitalization.";
    
    expect($error->text)->toEqual($text);
  });
});

describe('Querying a missing entry on a fieldset when requiring all entries is explicitly disabled', function() {
  it('produces the expected result', function() {
    $input = "fieldset:";

    $fieldset = Enolib\Parser::parse($input)->fieldset('fieldset');
    
    $fieldset->allEntriesRequired(false);
    $fieldset->entry('entry');

    expect('it passes')->toBeTruthy();
  });
});

describe('Querying a missing entry on a fieldset when requiring all entries is enabled and disabled again', function() {
  it('produces the expected result', function() {
    $input = "fieldset:";

    $fieldset = Enolib\Parser::parse($input)->fieldset('fieldset');
    
    $fieldset->allEntriesRequired(true);
    $fieldset->allEntriesRequired(false);
    $fieldset->entry('entry');

    expect('it passes')->toBeTruthy();
  });
});

describe('Querying a missing but explicitly optional entry on a fieldset when requiring all entries is enabled', function() {
  it('produces the expected result', function() {
    $input = "fieldset:";

    $fieldset = Enolib\Parser::parse($input)->fieldset('fieldset');
    
    $fieldset->allEntriesRequired();
    $fieldset->optionalEntry('entry');

    expect('it passes')->toBeTruthy();
  });
});