<?php declare(strict_types=1);

describe('Copying a non-section element that does not exist', function() {
  it('throws the expected ParseError', function() {
    $error = null;

    $input = "copy < element";

    try {
      Enolib\Parser::parse($input);
    } catch(Enolib\ParseError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ParseError');
    
    $text = "In line 1 the non-section element 'element' should be copied, but it was not found.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               " >    1 | copy < element";
    
    expect($error->snippet)->toEqual($snippet);
    
    $selection = [[0,0], [0,14]];
    
    expect($error->selection)->toEqual($selection);
  });
});

describe('Copying a non-section element whose key only exists on a section', function() {
  it('throws the expected ParseError', function() {
    $error = null;

    $input = "# section\n" .
             "\n" .
             "# other_section\n" .
             "\n" .
             "copy < section";

    try {
      Enolib\Parser::parse($input);
    } catch(Enolib\ParseError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ParseError');
    
    $text = "In line 5 the non-section element 'section' should be copied, but it was not found.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               "   ...\n" .
               "      3 | # other_section\n" .
               "      4 | \n" .
               " >    5 | copy < section";
    
    expect($error->snippet)->toEqual($snippet);
    
    $selection = [[4,0], [4,14]];
    
    expect($error->selection)->toEqual($selection);
  });
});

describe('Copying an implied fieldset whose key only exists on a section', function() {
  it('throws the expected ParseError', function() {
    $error = null;

    $input = "# section\n" .
             "\n" .
             "# other_section\n" .
             "\n" .
             "copy < section\n" .
             "entry = value";

    try {
      Enolib\Parser::parse($input);
    } catch(Enolib\ParseError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ParseError');
    
    $text = "In line 5 the non-section element 'section' should be copied, but it was not found.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               "   ...\n" .
               "      3 | # other_section\n" .
               "      4 | \n" .
               " >    5 | copy < section\n" .
               "      6 | entry = value";
    
    expect($error->snippet)->toEqual($snippet);
    
    $selection = [[4,0], [4,14]];
    
    expect($error->selection)->toEqual($selection);
  });
});

describe('Copying an implied list whose key only exists on a section', function() {
  it('throws the expected ParseError', function() {
    $error = null;

    $input = "# section\n" .
             "\n" .
             "# other_section\n" .
             "\n" .
             "copy < section\n" .
             "- item";

    try {
      Enolib\Parser::parse($input);
    } catch(Enolib\ParseError $_error) {
      $error = $_error;
    }

    expect($error)->toBeAnInstanceOf('Enolib\ParseError');
    
    $text = "In line 5 the non-section element 'section' should be copied, but it was not found.";
    
    expect($error->text)->toEqual($text);
    
    $snippet = "   Line | Content\n" .
               "   ...\n" .
               "      3 | # other_section\n" .
               "      4 | \n" .
               " >    5 | copy < section\n" .
               "      6 | - item";
    
    expect($error->snippet)->toEqual($snippet);
    
    $selection = [[4,0], [4,14]];
    
    expect($error->selection)->toEqual($selection);
  });
});