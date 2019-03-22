<?php declare(strict_types=1);

describe('Triggering an error inside a custom loader when querying a required comment on a field', function() {
  it('throws the expected ValidationError', function() {
    $error = null;

    $input = "> comment\n" .
             "field: value";

    try {
      Enolib\Parser::parse($input)->field('field')->requiredComment(function() { throw new Exception('my error'); });
    } catch(Enolib\ValidationError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
    
    $text = "There is a problem with the comment of this element: my error";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               " >    1 | > comment\n" .
               " *    2 | field: value";
    
    expect($error->snippet)->toEqual($snippet);
    
    $selection = [[0,2], [0,9]];
    
    expect($error->selection)->toEqual($selection);
  });
});