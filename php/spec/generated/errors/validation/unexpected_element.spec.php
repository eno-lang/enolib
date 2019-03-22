<?php declare(strict_types=1);

describe('Asserting everything was touched on an untouched document', function() {
  it('throws the expected ValidationError', function() {
    $error = null;

    $input = "field: value";

    try {
      Enolib\Parser::parse($input)->assertAllTouched();
    } catch(Enolib\ValidationError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
    
    $text = "This element was not expected, make sure it is at the right place in the document and that its key is not mis-typed.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               " >    1 | field: value";
    
    expect($error->snippet)->toEqual($snippet);
    
    $selection = [[0,0], [0,12]];
    
    expect($error->selection)->toEqual($selection);
  });
});

describe('Asserting everything was touched on an untouched document, with a custom message', function() {
  it('throws the expected ValidationError', function() {
    $error = null;

    $input = "field: value";

    try {
      Enolib\Parser::parse($input)->assertAllTouched('my custom message');
    } catch(Enolib\ValidationError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
    
    $text = "my custom message";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               " >    1 | field: value";
    
    expect($error->snippet)->toEqual($snippet);
    
    $selection = [[0,0], [0,12]];
    
    expect($error->selection)->toEqual($selection);
  });
});