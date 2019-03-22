<?php declare(strict_types=1);

describe('Starting a section two levels deeper than the current one', function() {
  it('throws the expected ParseError', function() {
    $error = null;

    $input = "# section\n" .
             "### subsubsection";

    try {
      Enolib\Parser::parse($input);
    } catch(Enolib\ParseError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ParseError');
    
    $text = "Line 2 starts a section that is more than one level deeper than the current one.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               " *    1 | # section\n" .
               " >    2 | ### subsubsection";
    
    expect($error->snippet)->toEqual($snippet);
    
    $selection = [[1,0], [1,17]];
    
    expect($error->selection)->toEqual($selection);
  });
});