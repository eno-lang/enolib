<?php declare(strict_types=1);

describe('Parsing a line continuation without any prior element', function() {
  it('throws the expected ParseError', function() {
    $error = null;

    $input = "| continuation";

    try {
      Enolib\Parser::parse($input);
    } catch(Enolib\ParseError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ParseError');
    
    $text = "Line 1 contains a line continuation without a continuable element being specified before.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               " >    1 | | continuation";
    
    expect($error->snippet)->toEqual($snippet);
    
    $selection = [[0,0], [0,14]];
    
    expect($error->selection)->toEqual($selection);
  });
});

describe('Parsing a line continuation preceded by a copied field', function() {
  it('throws the expected ParseError', function() {
    $error = null;

    $input = "field: value\n" .
             "\n" .
             "copy < field\n" .
             "| illegal_continuation";

    try {
      Enolib\Parser::parse($input);
    } catch(Enolib\ParseError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ParseError');
    
    $text = "Line 4 contains a line continuation without a continuable element being specified before.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               "   ...\n" .
               "      2 | \n" .
               "      3 | copy < field\n" .
               " >    4 | | illegal_continuation";
    
    expect($error->snippet)->toEqual($snippet);
    
    $selection = [[3,0], [3,22]];
    
    expect($error->selection)->toEqual($selection);
  });
});