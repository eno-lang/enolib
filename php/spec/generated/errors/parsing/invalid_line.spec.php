<?php declare(strict_types=1);

describe('A line without operators', function() {
  it('throws the expected ParseError', function() {
    $error = null;

    $input = "list:\n" .
             "- item\n" .
             "- item\n" .
             "illegal";

    try {
      Enolib\Parser::parse($input);
    } catch(Enolib\ParseError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ParseError');
    
    $text = "Line 4 does not follow any specified pattern.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               "   ...\n" .
               "      2 | - item\n" .
               "      3 | - item\n" .
               " >    4 | illegal";
    
    expect($error->snippet)->toEqual($snippet);
    
    $selection = [[3,0], [3,7]];
    
    expect($error->selection)->toEqual($selection);
  });
});