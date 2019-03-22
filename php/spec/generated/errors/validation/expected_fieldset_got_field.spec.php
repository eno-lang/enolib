<?php declare(strict_types=1);

describe('Expecting a fieldset but getting a field', function() {
  it('throws the expected ValidationError', function() {
    $error = null;

    $input = "field: value";

    try {
      Enolib\Parser::parse($input)->fieldset('field');
    } catch(Enolib\ValidationError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
    
    $text = "A fieldset with the key 'field' was expected.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               " >    1 | field: value";
    
    expect($error->snippet)->toEqual($snippet);
    
    $selection = [[0,0], [0,12]];
    
    expect($error->selection)->toEqual($selection);
  });
});

describe('Expecting a fieldset but getting a field with continuations', function() {
  it('throws the expected ValidationError', function() {
    $error = null;

    $input = "field:\n" .
             "| continuation\n" .
             "| continuation";

    try {
      Enolib\Parser::parse($input)->fieldset('field');
    } catch(Enolib\ValidationError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
    
    $text = "A fieldset with the key 'field' was expected.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               " >    1 | field:\n" .
               " *    2 | | continuation\n" .
               " *    3 | | continuation";
    
    expect($error->snippet)->toEqual($snippet);
    
    $selection = [[0,0], [2,14]];
    
    expect($error->selection)->toEqual($selection);
  });
});

describe('Expecting a fieldset but getting a field with continuations separated by idle lines', function() {
  it('throws the expected ValidationError', function() {
    $error = null;

    $input = "field: value\n" .
             "| continuation\n" .
             "| continuation\n" .
             "\n" .
             "> comment\n" .
             "| continuation";

    try {
      Enolib\Parser::parse($input)->fieldset('field');
    } catch(Enolib\ValidationError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
    
    $text = "A fieldset with the key 'field' was expected.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               " >    1 | field: value\n" .
               " *    2 | | continuation\n" .
               " *    3 | | continuation\n" .
               " *    4 | \n" .
               " *    5 | > comment\n" .
               " *    6 | | continuation";
    
    expect($error->snippet)->toEqual($snippet);
    
    $selection = [[0,0], [5,14]];
    
    expect($error->selection)->toEqual($selection);
  });
});