<?php declare(strict_types=1);

describe('Querying a fieldset entry for a required but missing value', function() {
  it('throws the expected ValidationError', function() {
    $error = null;

    $input = "fieldset:\n" .
             "entry =";

    try {
      Enolib\Parser::parse($input)->fieldset('fieldset')->entry('entry')->requiredStringValue();
    } catch(Enolib\ValidationError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
    
    $text = "The fieldset entry 'entry' must contain a value.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               "      1 | fieldset:\n" .
               " >    2 | entry =";
    
    expect($error->snippet)->toEqual($snippet);
    
    expect($error->selection['from']['line'])->toEqual(1);
    expect($error->selection['from']['column'])->toEqual(7);
    expect($error->selection['to']['line'])->toEqual(1);
    expect($error->selection['to']['column'])->toEqual(7);
  });
});