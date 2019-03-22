<?php declare(strict_types=1);

describe('Querying an existing, single-line, required string comment from a list', function() {
  it('produces the expected result', function() {
    $input = "> comment\n" .
             "list:\n" .
             "- item";

    $output = Enolib\Parser::parse($input)->list('list')->requiredStringComment();

    $expected = "comment";
    
    expect($output)->toEqual($expected);
  });
});

describe('Querying an existing, two-line, required string comment from a list', function() {
  it('produces the expected result', function() {
    $input = ">comment\n" .
             ">  comment\n" .
             "list:\n" .
             "- item";

    $output = Enolib\Parser::parse($input)->list('list')->requiredStringComment();

    $expected = "comment\n" .
                "  comment";
    
    expect($output)->toEqual($expected);
  });
});

describe('Querying an existing, required string comment with blank lines from a list', function() {
  it('produces the expected result', function() {
    $input = ">\n" .
             ">     comment\n" .
             ">\n" .
             ">   comment\n" .
             ">\n" .
             "> comment\n" .
             ">\n" .
             "list:\n" .
             "- item";

    $output = Enolib\Parser::parse($input)->list('list')->requiredStringComment();

    $expected = "    comment\n" .
                "\n" .
                "  comment\n" .
                "\n" .
                "comment";
    
    expect($output)->toEqual($expected);
  });
});

describe('Querying an optional, existing string comment from a list', function() {
  it('produces the expected result', function() {
    $input = "> comment\n" .
             "list:\n" .
             "- item";

    $output = Enolib\Parser::parse($input)->list('list')->optionalStringComment();

    $expected = "comment";
    
    expect($output)->toEqual($expected);
  });
});

describe('Querying an optional, missing string comment from a list', function() {
  it('produces the expected result', function() {
    $input = "list:\n" .
             "- item";

    $output = Enolib\Parser::parse($input)->list('list')->optionalStringComment();

    expect($output)->toBeNull();
  });
});