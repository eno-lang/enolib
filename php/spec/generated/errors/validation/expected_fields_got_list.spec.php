<?php declare(strict_types=1);

describe('Expecting fields but getting a list with one item', function() {
  it('throws the expected ValidationError', function() {
    $error = null;

    $input = "list:\n" .
             "- item";

    try {
      Enolib\Parser::parse($input)->fields('list');
    } catch(Enolib\ValidationError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
    
    $text = "Only fields with the key 'list' were expected.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               " >    1 | list:\n" .
               " *    2 | - item";
    
    expect($error->snippet)->toEqual($snippet);
    
    $selection = [[0,0], [1,6]];
    
    expect($error->selection)->toEqual($selection);
  });
});

describe('Expecting fields but getting a list with empty lines and multiple items', function() {
  it('throws the expected ValidationError', function() {
    $error = null;

    $input = "list:\n" .
             "\n" .
             "- item\n" .
             "\n" .
             "- item\n" .
             "\n" .
             "- item\n" .
             "";

    try {
      Enolib\Parser::parse($input)->fields('list');
    } catch(Enolib\ValidationError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
    
    $text = "Only fields with the key 'list' were expected.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               " >    1 | list:\n" .
               " *    2 | \n" .
               " *    3 | - item\n" .
               " *    4 | \n" .
               " *    5 | - item\n" .
               " *    6 | \n" .
               " *    7 | - item\n" .
               "      8 | ";
    
    expect($error->snippet)->toEqual($snippet);
    
    $selection = [[0,0], [6,6]];
    
    expect($error->selection)->toEqual($selection);
  });
});

describe('Expecting fields but getting a list with two items with comments', function() {
  it('throws the expected ValidationError', function() {
    $error = null;

    $input = "list:\n" .
             "> comment\n" .
             "- item\n" .
             "\n" .
             "> comment\n" .
             "- item";

    try {
      Enolib\Parser::parse($input)->fields('list');
    } catch(Enolib\ValidationError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
    
    $text = "Only fields with the key 'list' were expected.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               " >    1 | list:\n" .
               " *    2 | > comment\n" .
               " *    3 | - item\n" .
               " *    4 | \n" .
               " *    5 | > comment\n" .
               " *    6 | - item";
    
    expect($error->snippet)->toEqual($snippet);
    
    $selection = [[0,0], [5,6]];
    
    expect($error->selection)->toEqual($selection);
  });
});