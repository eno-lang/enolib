<?php declare(strict_types=1);

describe('Querying a section for a required but missing field', function() {
  it('throws the expected ValidationError', function() {
    $error = null;

    $input = "# section";

    try {
      Enolib\Parser::parse($input)->section('section')->requiredField('field');
    } catch(Enolib\ValidationError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
    
    $text = "The field 'field' is missing - in case it has been specified look for typos and also check for correct capitalization.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               " *    1 | # section";
    
    expect($error->snippet)->toEqual($snippet);
    
    $selection = [[0,9], [0,9]];
    
    expect($error->selection)->toEqual($selection);
  });
});