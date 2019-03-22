<?php declare(strict_types=1);

describe('Asserting everything was touched when the only present field was not touched', function() {
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

describe('Asserting everything was touched when the only present field was touched', function() {
  it('produces the expected result', function() {
    $input = "field: value";

    $document = Enolib\Parser::parse($input);
    
    $document->field('field')->touch();
    $document->assertAllTouched();

    expect('it passes')->toBeTruthy();
  });
});