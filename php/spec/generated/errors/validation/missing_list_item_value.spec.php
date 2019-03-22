<?php declare(strict_types=1);

describe('Directly querying a list item for a required but missing value', function() {
  it('throws the expected ValidationError', function() {
    $error = null;

    $input = "list:\n" .
             "-";

    try {
      Enolib\Parser::parse($input)->list('list')->items()[0]->requiredStringValue();
    } catch(Enolib\ValidationError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
    
    $text = "The list 'list' may not contain empty items.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               "      1 | list:\n" .
               " >    2 | -";
    
    expect($error->snippet)->toEqual($snippet);
    
    $selection = [[1,1], [1,1]];
    
    expect($error->selection)->toEqual($selection);
  });
});

describe('Indirectly querying a list with empty items for required values', function() {
  it('throws the expected ValidationError', function() {
    $error = null;

    $input = "list:\n" .
             "-";

    try {
      Enolib\Parser::parse($input)->list('list')->requiredStringValues();
    } catch(Enolib\ValidationError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
    
    $text = "The list 'list' may not contain empty items.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               "      1 | list:\n" .
               " >    2 | -";
    
    expect($error->snippet)->toEqual($snippet);
    
    $selection = [[1,1], [1,1]];
    
    expect($error->selection)->toEqual($selection);
  });
});