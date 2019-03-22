<?php declare(strict_types=1);

describe('Querying an existing, single-line, required string comment from a section', function() {
  it('produces the expected result', function() {
    $input = "> comment\n" .
             "# section";

    $output = Enolib\Parser::parse($input)->section('section')->requiredStringComment();

    $expected = "comment";
    
    expect($output)->toEqual($expected);
  });
});

describe('Querying an existing, two-line, required string comment from a section', function() {
  it('produces the expected result', function() {
    $input = ">comment\n" .
             ">  comment\n" .
             "# section";

    $output = Enolib\Parser::parse($input)->section('section')->requiredStringComment();

    $expected = "comment\n" .
                "  comment";
    
    expect($output)->toEqual($expected);
  });
});

describe('Querying an existing, required string comment with blank lines from a section', function() {
  it('produces the expected result', function() {
    $input = ">\n" .
             ">     comment\n" .
             ">\n" .
             ">   comment\n" .
             ">\n" .
             "> comment\n" .
             ">\n" .
             "# section";

    $output = Enolib\Parser::parse($input)->section('section')->requiredStringComment();

    $expected = "    comment\n" .
                "\n" .
                "  comment\n" .
                "\n" .
                "comment";
    
    expect($output)->toEqual($expected);
  });
});

describe('Querying an optional, existing string comment from a section', function() {
  it('produces the expected result', function() {
    $input = "> comment\n" .
             "# section";

    $output = Enolib\Parser::parse($input)->section('section')->optionalStringComment();

    $expected = "comment";
    
    expect($output)->toEqual($expected);
  });
});

describe('Querying an optional, missing string comment from a section', function() {
  it('produces the expected result', function() {
    $input = "# section";

    $output = Enolib\Parser::parse($input)->section('section')->optionalStringComment();

    expect($output)->toBeNull();
  });
});