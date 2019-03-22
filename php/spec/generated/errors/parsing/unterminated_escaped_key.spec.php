<?php declare(strict_types=1);

describe('A single field with an terminated escaped key', function() {
  it('throws the expected ParseError', function() {
    $error = null;

    $input = "`field: value";

    try {
      Enolib\Parser::parse($input);
    } catch(Enolib\ParseError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ParseError');
    
    $text = "In line 1 the key of an element is escaped, but the escape sequence is not terminated until the end of the line.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               " >    1 | `field: value";
    
    expect($error->snippet)->toEqual($snippet);
    
    $selection = [[0,1], [0,13]];
    
    expect($error->selection)->toEqual($selection);
  });
});

describe('A single section with an unterminated escaped key', function() {
  it('throws the expected ParseError', function() {
    $error = null;

    $input = "# `field: value";

    try {
      Enolib\Parser::parse($input);
    } catch(Enolib\ParseError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ParseError');
    
    $text = "In line 1 the key of an element is escaped, but the escape sequence is not terminated until the end of the line.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               " >    1 | # `field: value";
    
    expect($error->snippet)->toEqual($snippet);
    
    $selection = [[0,3], [0,15]];
    
    expect($error->selection)->toEqual($selection);
  });
});