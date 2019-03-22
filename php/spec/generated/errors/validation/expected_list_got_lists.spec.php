<?php declare(strict_types=1);

describe('Expecting a list but getting two lists', function() {
  it('throws the expected ValidationError', function() {
    $error = null;

    $input = "list:\n" .
             "- item\n" .
             "list:\n" .
             "- item";

    try {
      Enolib\Parser::parse($input)->list('list');
    } catch(Enolib\ValidationError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
    
    $text = "Only a single list with the key 'list' was expected.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               " >    1 | list:\n" .
               " *    2 | - item\n" .
               " >    3 | list:\n" .
               " *    4 | - item";
    
    expect($error->snippet)->toEqual($snippet);
    
    $selection = [[0,0], [1,6]];
    
    expect($error->selection)->toEqual($selection);
  });
});

describe('Expecting a list but getting two lists with comments, empty lines and continuations', function() {
  it('throws the expected ValidationError', function() {
    $error = null;

    $input = "> comment\n" .
             "list:\n" .
             "- item\n" .
             "\n" .
             "- item\n" .
             "\n" .
             "list:\n" .
             "> comment\n" .
             "- item\n" .
             "\\ continuation";

    try {
      Enolib\Parser::parse($input)->list('list');
    } catch(Enolib\ValidationError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
    
    $text = "Only a single list with the key 'list' was expected.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               "      1 | > comment\n" .
               " >    2 | list:\n" .
               " *    3 | - item\n" .
               " *    4 | \n" .
               " *    5 | - item\n" .
               "      6 | \n" .
               " >    7 | list:\n" .
               " *    8 | > comment\n" .
               " *    9 | - item\n" .
               " *   10 | \\ continuation";
    
    expect($error->snippet)->toEqual($snippet);
    
    $selection = [[1,0], [4,6]];
    
    expect($error->selection)->toEqual($selection);
  });
});