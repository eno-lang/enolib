<?php declare(strict_types=1);

describe('Expecting a list but getting a fieldset with one item', function() {
  it('throws the expected ValidationError', function() {
    $error = null;

    $input = "fieldset:\n" .
             "entry = value";

    try {
      Enolib\Parser::parse($input)->list('fieldset');
    } catch(Enolib\ValidationError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
    
    $text = "A list with the key 'fieldset' was expected.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               " >    1 | fieldset:\n" .
               " *    2 | entry = value";
    
    expect($error->snippet)->toEqual($snippet);
    
    $selection = [[0,0], [1,13]];
    
    expect($error->selection)->toEqual($selection);
  });
});

describe('Expecting a list but getting a fieldset with empty lines and multiple entries', function() {
  it('throws the expected ValidationError', function() {
    $error = null;

    $input = "fieldset:\n" .
             "\n" .
             "entry = value\n" .
             "\n" .
             "entry = value\n" .
             "\n" .
             "entry = value\n" .
             "";

    try {
      Enolib\Parser::parse($input)->list('fieldset');
    } catch(Enolib\ValidationError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
    
    $text = "A list with the key 'fieldset' was expected.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               " >    1 | fieldset:\n" .
               " *    2 | \n" .
               " *    3 | entry = value\n" .
               " *    4 | \n" .
               " *    5 | entry = value\n" .
               " *    6 | \n" .
               " *    7 | entry = value\n" .
               "      8 | ";
    
    expect($error->snippet)->toEqual($snippet);
    
    $selection = [[0,0], [6,13]];
    
    expect($error->selection)->toEqual($selection);
  });
});

describe('Expecting a list but getting a fieldset with two entries with comments', function() {
  it('throws the expected ValidationError', function() {
    $error = null;

    $input = "fieldset:\n" .
             "> comment\n" .
             "entry = value\n" .
             "\n" .
             "> comment\n" .
             "entry = value";

    try {
      Enolib\Parser::parse($input)->list('fieldset');
    } catch(Enolib\ValidationError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
    
    $text = "A list with the key 'fieldset' was expected.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               " >    1 | fieldset:\n" .
               " *    2 | > comment\n" .
               " *    3 | entry = value\n" .
               " *    4 | \n" .
               " *    5 | > comment\n" .
               " *    6 | entry = value";
    
    expect($error->snippet)->toEqual($snippet);
    
    $selection = [[0,0], [5,13]];
    
    expect($error->selection)->toEqual($selection);
  });
});