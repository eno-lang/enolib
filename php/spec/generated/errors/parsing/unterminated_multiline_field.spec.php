<?php declare(strict_types=1);

describe('A multiline field with an incomplete multiline field operator in the ending line', function() {
  it('throws the expected ParseError', function() {
    $error = null;

    $input = "-- multiline_field\n" .
             "value\n" .
             "value\n" .
             "value\n" .
             "- multiline_field";

    try {
      Enolib\Parser::parse($input);
    } catch(Enolib\ParseError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ParseError');
    
    $text = "The multiline field 'multiline_field' starting in line 1 is not terminated until the end of the document.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               " >    1 | -- multiline_field\n" .
               " *    2 | value\n" .
               " *    3 | value\n" .
               " *    4 | value\n" .
               " *    5 | - multiline_field";
    
    expect($error->snippet)->toEqual($snippet);
    
    $selection = [[0,0], [0,18]];
    
    expect($error->selection)->toEqual($selection);
  });
});

describe('A multiline field with an edge case key and missing space in the ending line', function() {
  it('throws the expected ParseError', function() {
    $error = null;

    $input = "-- -\n" .
             "value\n" .
             "value\n" .
             "value\n" .
             "---";

    try {
      Enolib\Parser::parse($input);
    } catch(Enolib\ParseError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ParseError');
    
    $text = "The multiline field '-' starting in line 1 is not terminated until the end of the document.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               " >    1 | -- -\n" .
               " *    2 | value\n" .
               " *    3 | value\n" .
               " *    4 | value\n" .
               " *    5 | ---";
    
    expect($error->snippet)->toEqual($snippet);
    
    $selection = [[0,0], [0,4]];
    
    expect($error->selection)->toEqual($selection);
  });
});