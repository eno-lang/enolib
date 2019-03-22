<?php declare(strict_types=1);

describe('Querying a section for a required but missing comment', function() {
  it('throws the expected ValidationError', function() {
    $error = null;

    $input = "# section";

    try {
      Enolib\Parser::parse($input)->section('section')->requiredComment();
    } catch(Enolib\ValidationError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
    
    $text = "A required comment for this element is missing.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               " >    1 | # section";
    
    expect($error->snippet)->toEqual($snippet);
    
    $selection = [[0,0], [0,0]];
    
    expect($error->selection)->toEqual($selection);
  });
});