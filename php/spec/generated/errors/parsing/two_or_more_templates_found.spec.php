<?php declare(strict_types=1);

describe('Copying a field that exists twice', function() {
  it('throws the expected ParseError', function() {
    $error = null;

    $input = "field: value\n" .
             "field: value\n" .
             "\n" .
             "copy < field";

    try {
      Enolib\Parser::parse($input);
    } catch(Enolib\ParseError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ParseError');
    
    $text = "There are at least two elements with the key 'field' that qualify for being copied here, it is not clear which to copy.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               " ?    1 | field: value\n" .
               " ?    2 | field: value\n" .
               "      3 | \n" .
               " >    4 | copy < field";
    
    expect($error->snippet)->toEqual($snippet);
    
    expect($error->selection['from']['line'])->toEqual(3);
    expect($error->selection['from']['column'])->toEqual(0);
    expect($error->selection['to']['line'])->toEqual(3);
    expect($error->selection['to']['column'])->toEqual(12);
  });
});

describe('Copying a section that exists twice', function() {
  it('throws the expected ParseError', function() {
    $error = null;

    $input = "# section\n" .
             "\n" .
             "# section\n" .
             "\n" .
             "# copy < section";

    try {
      Enolib\Parser::parse($input);
    } catch(Enolib\ParseError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ParseError');
    
    $text = "There are at least two elements with the key 'section' that qualify for being copied here, it is not clear which to copy.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               " ?    1 | # section\n" .
               "      2 | \n" .
               " ?    3 | # section\n" .
               "      4 | \n" .
               " >    5 | # copy < section";
    
    expect($error->snippet)->toEqual($snippet);
    
    expect($error->selection['from']['line'])->toEqual(4);
    expect($error->selection['from']['column'])->toEqual(0);
    expect($error->selection['to']['line'])->toEqual(4);
    expect($error->selection['to']['column'])->toEqual(16);
  });
});