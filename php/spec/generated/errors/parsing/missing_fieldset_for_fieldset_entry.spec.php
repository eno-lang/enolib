<?php declare(strict_types=1);

describe('Parsing a fieldset entry without a fieldset', function() {
  it('throws the expected ParseError', function() {
    $error = null;

    $input = "entry = value";

    try {
      Enolib\Parser::parse($input);
    } catch(Enolib\ParseError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ParseError');
    
    $text = "Line 1 contains a fieldset entry without a fieldset being specified before.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               " >    1 | entry = value";
    
    expect($error->snippet)->toEqual($snippet);
    
    expect($error->selection['from']['line'])->toEqual(0);
    expect($error->selection['from']['column'])->toEqual(0);
    expect($error->selection['to']['line'])->toEqual(0);
    expect($error->selection['to']['column'])->toEqual(13);
  });
});

describe('Parsing a fieldset entry preceded by a line continuation', function() {
  it('throws the expected ParseError', function() {
    $error = null;

    $input = "field:\n" .
             "| line_continuation\n" .
             "entry = value";

    try {
      Enolib\Parser::parse($input);
    } catch(Enolib\ParseError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ParseError');
    
    $text = "Line 3 contains a fieldset entry without a fieldset being specified before.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               "      1 | field:\n" .
               "      2 | | line_continuation\n" .
               " >    3 | entry = value";
    
    expect($error->snippet)->toEqual($snippet);
    
    expect($error->selection['from']['line'])->toEqual(2);
    expect($error->selection['from']['column'])->toEqual(0);
    expect($error->selection['to']['line'])->toEqual(2);
    expect($error->selection['to']['column'])->toEqual(13);
  });
});

describe('Parsing a fieldset entry preceded by a field', function() {
  it('throws the expected ParseError', function() {
    $error = null;

    $input = "field: value\n" .
             "entry = value";

    try {
      Enolib\Parser::parse($input);
    } catch(Enolib\ParseError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ParseError');
    
    $text = "Line 2 contains a fieldset entry without a fieldset being specified before.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               "      1 | field: value\n" .
               " >    2 | entry = value";
    
    expect($error->snippet)->toEqual($snippet);
    
    expect($error->selection['from']['line'])->toEqual(1);
    expect($error->selection['from']['column'])->toEqual(0);
    expect($error->selection['to']['line'])->toEqual(1);
    expect($error->selection['to']['column'])->toEqual(13);
  });
});

describe('Parsing a fieldset entry preceded by a list item', function() {
  it('throws the expected ParseError', function() {
    $error = null;

    $input = "list:\n" .
             "- item\n" .
             "entry = value";

    try {
      Enolib\Parser::parse($input);
    } catch(Enolib\ParseError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ParseError');
    
    $text = "Line 3 contains a fieldset entry without a fieldset being specified before.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               "      1 | list:\n" .
               "      2 | - item\n" .
               " >    3 | entry = value";
    
    expect($error->snippet)->toEqual($snippet);
    
    expect($error->selection['from']['line'])->toEqual(2);
    expect($error->selection['from']['column'])->toEqual(0);
    expect($error->selection['to']['line'])->toEqual(2);
    expect($error->selection['to']['column'])->toEqual(13);
  });
});

describe('Parsing a fieldset entry preceded by a copied field', function() {
  it('throws the expected ParseError', function() {
    $error = null;

    $input = "field: value\n" .
             "\n" .
             "copy < field\n" .
             "entry = value";

    try {
      Enolib\Parser::parse($input);
    } catch(Enolib\ParseError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ParseError');
    
    $text = "Line 4 contains a fieldset entry without a fieldset being specified before.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               "   ...\n" .
               "      2 | \n" .
               "      3 | copy < field\n" .
               " >    4 | entry = value";
    
    expect($error->snippet)->toEqual($snippet);
    
    expect($error->selection['from']['line'])->toEqual(3);
    expect($error->selection['from']['column'])->toEqual(0);
    expect($error->selection['to']['line'])->toEqual(3);
    expect($error->selection['to']['column'])->toEqual(13);
  });
});

describe('Parsing a fieldset entry preceded by a copied list', function() {
  it('throws the expected ParseError', function() {
    $error = null;

    $input = "list:\n" .
             "- item\n" .
             "\n" .
             "copy < list\n" .
             "entry = value";

    try {
      Enolib\Parser::parse($input);
    } catch(Enolib\ParseError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ParseError');
    
    $text = "Line 5 contains a fieldset entry without a fieldset being specified before.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               "   ...\n" .
               "      3 | \n" .
               "      4 | copy < list\n" .
               " >    5 | entry = value";
    
    expect($error->snippet)->toEqual($snippet);
    
    expect($error->selection['from']['line'])->toEqual(4);
    expect($error->selection['from']['column'])->toEqual(0);
    expect($error->selection['to']['line'])->toEqual(4);
    expect($error->selection['to']['column'])->toEqual(13);
  });
});

describe('Parsing a fieldset entry preceded by a copied empty multiline field', function() {
  it('throws the expected ParseError', function() {
    $error = null;

    $input = "-- multiline field\n" .
             "-- multiline field\n" .
             "\n" .
             "copy < multiline field\n" .
             "entry = value";

    try {
      Enolib\Parser::parse($input);
    } catch(Enolib\ParseError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ParseError');
    
    $text = "Line 5 contains a fieldset entry without a fieldset being specified before.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               "   ...\n" .
               "      3 | \n" .
               "      4 | copy < multiline field\n" .
               " >    5 | entry = value";
    
    expect($error->snippet)->toEqual($snippet);
    
    expect($error->selection['from']['line'])->toEqual(4);
    expect($error->selection['from']['column'])->toEqual(0);
    expect($error->selection['to']['line'])->toEqual(4);
    expect($error->selection['to']['column'])->toEqual(13);
  });
});

describe('Parsing a fieldset entry preceded by a copied multiline field', function() {
  it('throws the expected ParseError', function() {
    $error = null;

    $input = "-- multiline field\n" .
             "value\n" .
             "-- multiline field\n" .
             "\n" .
             "copy < multiline field\n" .
             "entry = value";

    try {
      Enolib\Parser::parse($input);
    } catch(Enolib\ParseError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ParseError');
    
    $text = "Line 6 contains a fieldset entry without a fieldset being specified before.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               "   ...\n" .
               "      4 | \n" .
               "      5 | copy < multiline field\n" .
               " >    6 | entry = value";
    
    expect($error->snippet)->toEqual($snippet);
    
    expect($error->selection['from']['line'])->toEqual(5);
    expect($error->selection['from']['column'])->toEqual(0);
    expect($error->selection['to']['line'])->toEqual(5);
    expect($error->selection['to']['column'])->toEqual(13);
  });
});