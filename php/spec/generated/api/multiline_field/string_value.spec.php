<?php declare(strict_types=1);

describe('Querying an existing required string value from a multline field', function() {
  it('produces the expected result', function() {
    $input = "-- multiline_field\n" .
             "value\n" .
             "-- multiline_field";

    $output = Enolib\Parser::parse($input)->field('multiline_field')->requiredStringValue();

    $expected = "value";
    
    expect($output)->toEqual($expected);
  });
});

describe('Querying an existing optional string value from a multline field', function() {
  it('produces the expected result', function() {
    $input = "-- multiline_field\n" .
             "value\n" .
             "-- multiline_field";

    $output = Enolib\Parser::parse($input)->field('multiline_field')->optionalStringValue();

    $expected = "value";
    
    expect($output)->toEqual($expected);
  });
});

describe('Querying a missing optional string value from a multline field', function() {
  it('produces the expected result', function() {
    $input = "-- multiline_field\n" .
             "-- multiline_field";

    $output = Enolib\Parser::parse($input)->field('multiline_field')->optionalStringValue();

    expect($output)->toBeNull();
  });
});