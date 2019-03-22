<?php declare(strict_types=1);

describe('Asserting everything was touched when the only present fieldset was not touched', function() {
  it('throws the expected ValidationError', function() {
    $error = null;

    $input = "fieldset:\n" .
             "entry = value";

    try {
      Enolib\Parser::parse($input)->assertAllTouched();
    } catch(Enolib\ValidationError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
    
    $text = "This element was not expected, make sure it is at the right place in the document and that its key is not mis-typed.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               " >    1 | fieldset:\n" .
               " *    2 | entry = value";
    
    expect($error->snippet)->toEqual($snippet);
    
    $selection = [[0,0], [1,13]];
    
    expect($error->selection)->toEqual($selection);
  });
});

describe('Asserting everything was touched when the only present fieldset was touched', function() {
  it('produces the expected result', function() {
    $input = "fieldset:\n" .
             "entry = value";

    $document = Enolib\Parser::parse($input);
    
    $document->fieldset('fieldset')->touch();
    $document->assertAllTouched();

    expect('it passes')->toBeTruthy();
  });
});