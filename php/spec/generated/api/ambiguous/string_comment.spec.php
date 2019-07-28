<?php declare(strict_types=1);

describe('Querying an existing, single-line, required string comment from an ambiguous element', function() {
  it('produces the expected result', function() {
    $input = "> comment\n" .
             "ambiguous:";

    $output = Enolib\Parser::parse($input)->element('ambiguous')->requiredStringComment();

    $expected = "comment";
    
    expect($output)->toEqual($expected);
  });
});

describe('Querying an existing, two-line, required string comment from an ambiguous element', function() {
  it('produces the expected result', function() {
    $input = ">comment\n" .
             ">  comment\n" .
             "ambiguous:";

    $output = Enolib\Parser::parse($input)->element('ambiguous')->requiredStringComment();

    $expected = "comment\n" .
                "  comment";
    
    expect($output)->toEqual($expected);
  });
});

describe('Querying an existing, required string comment with blank lines from an ambiguous element', function() {
  it('produces the expected result', function() {
    $input = ">\n" .
             ">     comment\n" .
             ">\n" .
             ">   comment\n" .
             ">\n" .
             "> comment\n" .
             ">\n" .
             "ambiguous:";

    $output = Enolib\Parser::parse($input)->element('ambiguous')->requiredStringComment();

    $expected = "    comment\n" .
                "\n" .
                "  comment\n" .
                "\n" .
                "comment";
    
    expect($output)->toEqual($expected);
  });
});

describe('Querying an optional, existing string comment from an ambiguous element', function() {
  it('produces the expected result', function() {
    $input = "> comment\n" .
             "ambiguous:";

    $output = Enolib\Parser::parse($input)->element('ambiguous')->optionalStringComment();

    $expected = "comment";
    
    expect($output)->toEqual($expected);
  });
});

describe('Querying an optional, missing string comment from an ambiguous element', function() {
  it('produces the expected result', function() {
    $input = "ambiguous:";

    $output = Enolib\Parser::parse($input)->element('ambiguous')->optionalStringComment();

    expect($output)->toBeNull();
  });
});