<?php declare(strict_types=1);

describe('Querying the document for a required but missing list', function() {
  it('throws the expected ValidationError', function() {
    $error = null;

    $input = "";

    try {
      Enolib\Parser::parse($input)->requiredList('list');
    } catch(Enolib\ValidationError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
    
    $text = "The list 'list' is missing - in case it has been specified look for typos and also check for correct capitalization.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               " ?    1 | ";
    
    expect($error->snippet)->toEqual($snippet);
    
    $selection = [[0,0], [0,0]];
    
    expect($error->selection)->toEqual($selection);
  });
});

describe('Querying a section for a required but missing list', function() {
  it('throws the expected ValidationError', function() {
    $error = null;

    $input = "# section";

    try {
      Enolib\Parser::parse($input)->section('section')->requiredList('list');
    } catch(Enolib\ValidationError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
    
    $text = "The list 'list' is missing - in case it has been specified look for typos and also check for correct capitalization.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               " *    1 | # section";
    
    expect($error->snippet)->toEqual($snippet);
    
    $selection = [[0,9], [0,9]];
    
    expect($error->selection)->toEqual($selection);
  });
});