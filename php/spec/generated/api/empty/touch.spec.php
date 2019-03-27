<?php declare(strict_types=1);

describe('Asserting everything was touched when the only present empty element was not touched', function() {
  it('throws the expected ValidationError', function() {
    $error = null;

    $input = "element:";

    try {
      Enolib\Parser::parse($input)->assertAllTouched();
    } catch(Enolib\ValidationError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
    
    $text = "This element was not expected, make sure it is at the right place in the document and that its key is not mis-typed.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               " >    1 | element:";
    
    expect($error->snippet)->toEqual($snippet);
    
    expect($error->selection['from']['line'])->toEqual(0);
    expect($error->selection['from']['column'])->toEqual(0);
    expect($error->selection['to']['line'])->toEqual(0);
    expect($error->selection['to']['column'])->toEqual(8);
  });
});

describe('Asserting everything was touched when the only present empty element was touched', function() {
  it('produces the expected result', function() {
    $input = "element:";

    $document = Enolib\Parser::parse($input);
    
    $document->element('element')->touch();
    $document->assertAllTouched();

    expect('it passes')->toBeTruthy();
  });
});

describe('Asserting everything was touched when the only present empty element was touched after typecasting to a field', function() {
  it('produces the expected result', function() {
    $input = "field:";

    $document = Enolib\Parser::parse($input);
    
    $document->field('field')->touch();
    $document->assertAllTouched();

    expect('it passes')->toBeTruthy();
  });
});

describe('Asserting everything was touched when the only present empty element was touched after typecasting to a fieldset', function() {
  it('produces the expected result', function() {
    $input = "fieldset:";

    $document = Enolib\Parser::parse($input);
    
    $document->fieldset('fieldset')->touch();
    $document->assertAllTouched();

    expect('it passes')->toBeTruthy();
  });
});

describe('Asserting everything was touched when the only present empty element was touched after typecasting to a list', function() {
  it('produces the expected result', function() {
    $input = "list:";

    $document = Enolib\Parser::parse($input);
    
    $document->list('list')->touch();
    $document->assertAllTouched();

    expect('it passes')->toBeTruthy();
  });
});