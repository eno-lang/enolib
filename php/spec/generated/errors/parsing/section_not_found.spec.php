<?php declare(strict_types=1);

describe('Copying a section that does not exist', function() {
  it('throws the expected ParseError', function() {
    $error = null;

    $input = "# copy < section";

    try {
      Enolib\Parser::parse($input);
    } catch(Enolib\ParseError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ParseError');
    
    $text = "In line 1 the section 'section' should be copied, but it was not found.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               " >    1 | # copy < section";
    
    expect($error->snippet)->toEqual($snippet);
    
    expect($error->selection['from']['line'])->toEqual(0);
    expect($error->selection['from']['column'])->toEqual(0);
    expect($error->selection['to']['line'])->toEqual(0);
    expect($error->selection['to']['column'])->toEqual(16);
  });
});

describe('Copying a section whose key only exists on a field', function() {
  it('throws the expected ParseError', function() {
    $error = null;

    $input = "field: value\n" .
             "\n" .
             "# copy < field";

    try {
      Enolib\Parser::parse($input);
    } catch(Enolib\ParseError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ParseError');
    
    $text = "In line 3 the section 'field' should be copied, but it was not found.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               "      1 | field: value\n" .
               "      2 | \n" .
               " >    3 | # copy < field";
    
    expect($error->snippet)->toEqual($snippet);
    
    expect($error->selection['from']['line'])->toEqual(2);
    expect($error->selection['from']['column'])->toEqual(0);
    expect($error->selection['to']['line'])->toEqual(2);
    expect($error->selection['to']['column'])->toEqual(14);
  });
});

describe('Copying a section whose key only exists on a fieldset', function() {
  it('throws the expected ParseError', function() {
    $error = null;

    $input = "fieldset:\n" .
             "entry = value\n" .
             "\n" .
             "# copy < fieldset";

    try {
      Enolib\Parser::parse($input);
    } catch(Enolib\ParseError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ParseError');
    
    $text = "In line 4 the section 'fieldset' should be copied, but it was not found.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               "   ...\n" .
               "      2 | entry = value\n" .
               "      3 | \n" .
               " >    4 | # copy < fieldset";
    
    expect($error->snippet)->toEqual($snippet);
    
    expect($error->selection['from']['line'])->toEqual(3);
    expect($error->selection['from']['column'])->toEqual(0);
    expect($error->selection['to']['line'])->toEqual(3);
    expect($error->selection['to']['column'])->toEqual(17);
  });
});

describe('Copying a section whose key only exists on a list', function() {
  it('throws the expected ParseError', function() {
    $error = null;

    $input = "list:\n" .
             "- item\n" .
             "\n" .
             "# copy < list";

    try {
      Enolib\Parser::parse($input);
    } catch(Enolib\ParseError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ParseError');
    
    $text = "In line 4 the section 'list' should be copied, but it was not found.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               "   ...\n" .
               "      2 | - item\n" .
               "      3 | \n" .
               " >    4 | # copy < list";
    
    expect($error->snippet)->toEqual($snippet);
    
    expect($error->selection['from']['line'])->toEqual(3);
    expect($error->selection['from']['column'])->toEqual(0);
    expect($error->selection['to']['line'])->toEqual(3);
    expect($error->selection['to']['column'])->toEqual(13);
  });
});

describe('Copying a section whose key only exists on a multiline field', function() {
  it('throws the expected ParseError', function() {
    $error = null;

    $input = "-- multiline_field\n" .
             "value\n" .
             "-- multiline_field\n" .
             "\n" .
             "# copy < multiline_field";

    try {
      Enolib\Parser::parse($input);
    } catch(Enolib\ParseError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ParseError');
    
    $text = "In line 5 the section 'multiline_field' should be copied, but it was not found.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               "   ...\n" .
               "      3 | -- multiline_field\n" .
               "      4 | \n" .
               " >    5 | # copy < multiline_field";
    
    expect($error->snippet)->toEqual($snippet);
    
    expect($error->selection['from']['line'])->toEqual(4);
    expect($error->selection['from']['column'])->toEqual(0);
    expect($error->selection['to']['line'])->toEqual(4);
    expect($error->selection['to']['column'])->toEqual(24);
  });
});

describe('Copying a section whose key only exists on an empty multiline field', function() {
  it('throws the expected ParseError', function() {
    $error = null;

    $input = "-- multiline_field\n" .
             "-- multiline_field\n" .
             "\n" .
             "# copy < multiline_field";

    try {
      Enolib\Parser::parse($input);
    } catch(Enolib\ParseError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ParseError');
    
    $text = "In line 4 the section 'multiline_field' should be copied, but it was not found.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               "   ...\n" .
               "      2 | -- multiline_field\n" .
               "      3 | \n" .
               " >    4 | # copy < multiline_field";
    
    expect($error->snippet)->toEqual($snippet);
    
    expect($error->selection['from']['line'])->toEqual(3);
    expect($error->selection['from']['column'])->toEqual(0);
    expect($error->selection['to']['line'])->toEqual(3);
    expect($error->selection['to']['column'])->toEqual(24);
  });
});

describe('Copying a section whose key only exists on a fieldset entry', function() {
  it('throws the expected ParseError', function() {
    $error = null;

    $input = "fieldset:\n" .
             "entry = value\n" .
             "\n" .
             "# copy < entry";

    try {
      Enolib\Parser::parse($input);
    } catch(Enolib\ParseError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ParseError');
    
    $text = "In line 4 the section 'entry' should be copied, but it was not found.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               "   ...\n" .
               "      2 | entry = value\n" .
               "      3 | \n" .
               " >    4 | # copy < entry";
    
    expect($error->snippet)->toEqual($snippet);
    
    expect($error->selection['from']['line'])->toEqual(3);
    expect($error->selection['from']['column'])->toEqual(0);
    expect($error->selection['to']['line'])->toEqual(3);
    expect($error->selection['to']['column'])->toEqual(14);
  });
});