<?php declare(strict_types=1);

describe('Expecting a fieldset but getting two fieldsets', function() {
  it('throws the expected ValidationError', function() {
    $error = null;

    $input = "fieldset:\n" .
             "entry = value\n" .
             "fieldset:\n" .
             "entry = value";

    try {
      Enolib\Parser::parse($input)->fieldset('fieldset');
    } catch(Enolib\ValidationError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
    
    $text = "Only a single fieldset with the key 'fieldset' was expected.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               " >    1 | fieldset:\n" .
               " *    2 | entry = value\n" .
               " >    3 | fieldset:\n" .
               " *    4 | entry = value";
    
    expect($error->snippet)->toEqual($snippet);
    
    $selection = [[0,0], [1,13]];
    
    expect($error->selection)->toEqual($selection);
  });
});

describe('Expecting a fieldset but getting two fieldsets with comments, empty lines and continuations', function() {
  it('throws the expected ValidationError', function() {
    $error = null;

    $input = "> comment\n" .
             "fieldset:\n" .
             "entry = value\n" .
             "\n" .
             "entry = value\n" .
             "\n" .
             "fieldset:\n" .
             "> comment\n" .
             "entry = value";

    try {
      Enolib\Parser::parse($input)->fieldset('fieldset');
    } catch(Enolib\ValidationError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
    
    $text = "Only a single fieldset with the key 'fieldset' was expected.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               "      1 | > comment\n" .
               " >    2 | fieldset:\n" .
               " *    3 | entry = value\n" .
               " *    4 | \n" .
               " *    5 | entry = value\n" .
               "      6 | \n" .
               " >    7 | fieldset:\n" .
               " *    8 | > comment\n" .
               " *    9 | entry = value";
    
    expect($error->snippet)->toEqual($snippet);
    
    $selection = [[1,0], [4,13]];
    
    expect($error->selection)->toEqual($selection);
  });
});