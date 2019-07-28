<?php declare(strict_types=1);

describe('Querying an existing, single-line, required string comment from an empty', function() {
  it('produces the expected result', function() {
    $input = "> comment\n" .
             "empty";

    $output = Enolib\Parser::parse($input)->empty('empty')->requiredStringComment();

    $expected = "comment";
    
    expect($output)->toEqual($expected);
  });
});

describe('Querying an existing, two-line, required string comment from an empty', function() {
  it('produces the expected result', function() {
    $input = ">comment\n" .
             ">  comment\n" .
             "empty";

    $output = Enolib\Parser::parse($input)->empty('empty')->requiredStringComment();

    $expected = "comment\n" .
                "  comment";
    
    expect($output)->toEqual($expected);
  });
});

describe('Querying an existing, required string comment with blank lines from an empty', function() {
  it('produces the expected result', function() {
    $input = ">\n" .
             ">     comment\n" .
             ">\n" .
             ">   comment\n" .
             ">\n" .
             "> comment\n" .
             ">\n" .
             "empty";

    $output = Enolib\Parser::parse($input)->empty('empty')->requiredStringComment();

    $expected = "    comment\n" .
                "\n" .
                "  comment\n" .
                "\n" .
                "comment";
    
    expect($output)->toEqual($expected);
  });
});

describe('Querying an optional, existing string comment from an empty', function() {
  it('produces the expected result', function() {
    $input = "> comment\n" .
             "empty";

    $output = Enolib\Parser::parse($input)->empty('empty')->optionalStringComment();

    $expected = "comment";
    
    expect($output)->toEqual($expected);
  });
});

describe('Querying an optional, missing string comment from an empty', function() {
  it('produces the expected result', function() {
    $input = "empty";

    $output = Enolib\Parser::parse($input)->empty('empty')->optionalStringComment();

    expect($output)->toBeNull();
  });
});