<?php declare(strict_types=1);

describe('Expecting an element but getting two elements', function() {
  it('throws the expected ValidationError', function() {
    $error = null;

    $input = "element:\n" .
             "element:";

    try {
      Enolib\Parser::parse($input)->element('element');
    } catch(Enolib\ValidationError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
    
    $text = "Only a single element with the key 'element' was expected.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               " >    1 | element:\n" .
               " >    2 | element:";
    
    expect($error->snippet)->toEqual($snippet);
    
    expect($error->selection['from']['line'])->toEqual(0);
    expect($error->selection['from']['column'])->toEqual(0);
    expect($error->selection['to']['line'])->toEqual(0);
    expect($error->selection['to']['column'])->toEqual(8);
  });
});

describe('Expecting an element but getting two elements with comments and empty lines', function() {
  it('throws the expected ValidationError', function() {
    $error = null;

    $input = "> comment\n" .
             "element:\n" .
             "\n" .
             "> comment\n" .
             "element:";

    try {
      Enolib\Parser::parse($input)->element('element');
    } catch(Enolib\ValidationError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
    
    $text = "Only a single element with the key 'element' was expected.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               "      1 | > comment\n" .
               " >    2 | element:\n" .
               "      3 | \n" .
               "      4 | > comment\n" .
               " >    5 | element:";
    
    expect($error->snippet)->toEqual($snippet);
    
    expect($error->selection['from']['line'])->toEqual(1);
    expect($error->selection['from']['column'])->toEqual(0);
    expect($error->selection['to']['line'])->toEqual(1);
    expect($error->selection['to']['column'])->toEqual(8);
  });
});