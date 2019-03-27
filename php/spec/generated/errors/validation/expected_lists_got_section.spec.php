<?php declare(strict_types=1);

describe('Expecting lists but getting an empty section', function() {
  it('throws the expected ValidationError', function() {
    $error = null;

    $input = "# section";

    try {
      Enolib\Parser::parse($input)->lists('section');
    } catch(Enolib\ValidationError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
    
    $text = "Only lists with the key 'section' were expected.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               " >    1 | # section";
    
    expect($error->snippet)->toEqual($snippet);
    
    expect($error->selection['from']['line'])->toEqual(0);
    expect($error->selection['from']['column'])->toEqual(0);
    expect($error->selection['to']['line'])->toEqual(0);
    expect($error->selection['to']['column'])->toEqual(9);
  });
});

describe('Expecting lists but getting a section with a field and a list', function() {
  it('throws the expected ValidationError', function() {
    $error = null;

    $input = "# section\n" .
             "\n" .
             "field: value\n" .
             "\n" .
             "list:\n" .
             "- item\n" .
             "- item";

    try {
      Enolib\Parser::parse($input)->lists('section');
    } catch(Enolib\ValidationError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
    
    $text = "Only lists with the key 'section' were expected.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               " >    1 | # section\n" .
               " *    2 | \n" .
               " *    3 | field: value\n" .
               " *    4 | \n" .
               " *    5 | list:\n" .
               " *    6 | - item\n" .
               " *    7 | - item";
    
    expect($error->snippet)->toEqual($snippet);
    
    expect($error->selection['from']['line'])->toEqual(0);
    expect($error->selection['from']['column'])->toEqual(0);
    expect($error->selection['to']['line'])->toEqual(6);
    expect($error->selection['to']['column'])->toEqual(6);
  });
});

describe('Expecting lists but getting a section with subsections', function() {
  it('throws the expected ValidationError', function() {
    $error = null;

    $input = "# section\n" .
             "\n" .
             "## subsection\n" .
             "\n" .
             "field: value\n" .
             "\n" .
             "## subsection\n" .
             "\n" .
             "list:\n" .
             "- item\n" .
             "- item";

    try {
      Enolib\Parser::parse($input)->lists('section');
    } catch(Enolib\ValidationError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ValidationError');
    
    $text = "Only lists with the key 'section' were expected.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               " >    1 | # section\n" .
               " *    2 | \n" .
               " *    3 | ## subsection\n" .
               " *    4 | \n" .
               " *    5 | field: value\n" .
               " *    6 | \n" .
               " *    7 | ## subsection\n" .
               " *    8 | \n" .
               " *    9 | list:\n" .
               " *   10 | - item\n" .
               " *   11 | - item";
    
    expect($error->snippet)->toEqual($snippet);
    
    expect($error->selection['from']['line'])->toEqual(0);
    expect($error->selection['from']['column'])->toEqual(0);
    expect($error->selection['to']['line'])->toEqual(10);
    expect($error->selection['to']['column'])->toEqual(6);
  });
});