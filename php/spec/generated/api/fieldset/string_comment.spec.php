<?php declare(strict_types=1);

describe('Querying an existing, single-line, required string comment from a fieldset', function() {
  it('produces the expected result', function() {
    $input = "> comment\n" .
             "fieldset:\n" .
             "entry = value";

    $output = Enolib\Parser::parse($input)->fieldset('fieldset')->requiredStringComment();

    $expected = "comment";
    
    expect($output)->toEqual($expected);
  });
});

describe('Querying an existing, two-line, required string comment from a fieldset', function() {
  it('produces the expected result', function() {
    $input = ">comment\n" .
             ">  comment\n" .
             "fieldset:\n" .
             "entry = value";

    $output = Enolib\Parser::parse($input)->fieldset('fieldset')->requiredStringComment();

    $expected = "comment\n" .
                "  comment";
    
    expect($output)->toEqual($expected);
  });
});

describe('Querying an existing, required string comment with blank lines from a fieldset', function() {
  it('produces the expected result', function() {
    $input = ">\n" .
             ">     comment\n" .
             ">\n" .
             ">   comment\n" .
             ">\n" .
             "> comment\n" .
             ">\n" .
             "fieldset:\n" .
             "entry = value";

    $output = Enolib\Parser::parse($input)->fieldset('fieldset')->requiredStringComment();

    $expected = "    comment\n" .
                "\n" .
                "  comment\n" .
                "\n" .
                "comment";
    
    expect($output)->toEqual($expected);
  });
});

describe('Querying an optional, existing string comment from a fieldset', function() {
  it('produces the expected result', function() {
    $input = "> comment\n" .
             "fieldset:\n" .
             "entry = value";

    $output = Enolib\Parser::parse($input)->fieldset('fieldset')->optionalStringComment();

    $expected = "comment";
    
    expect($output)->toEqual($expected);
  });
});

describe('Querying an optional, missing string comment from a fieldset', function() {
  it('produces the expected result', function() {
    $input = "fieldset:\n" .
             "entry = value";

    $output = Enolib\Parser::parse($input)->fieldset('fieldset')->optionalStringComment();

    expect($output)->toBeNull();
  });
});