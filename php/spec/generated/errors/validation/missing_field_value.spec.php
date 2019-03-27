<?php declare(strict_types=1);

describe('Querying a field for a required but missing value', function() {
  it('throws the expected ValidationError', function() {
    $error = null;

    $input = "field:";

    try {
      Enolib\Parser::parse($input)->field('field')->requiredStringValue();
    } catch(Enolib\ValidationError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
    
    $text = "The field 'field' must contain a value.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               " >    1 | field:";
    
    expect($error->snippet)->toEqual($snippet);
    
    expect($error->selection['from']['line'])->toEqual(0);
    expect($error->selection['from']['column'])->toEqual(6);
    expect($error->selection['to']['line'])->toEqual(0);
    expect($error->selection['to']['column'])->toEqual(6);
  });
});