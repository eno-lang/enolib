<?php declare(strict_types=1);

describe('Querying an existing required string value from a field', function() {
  it('produces the expected result', function() {
    $input = "field: value";

    $output = Enolib\Parser::parse($input)->field('field')->requiredStringValue();

    $expected = "value";
    
    expect($output)->toEqual($expected);
  });
});

describe('Querying an existing optional string value from a field', function() {
  it('produces the expected result', function() {
    $input = "field: value";

    $output = Enolib\Parser::parse($input)->field('field')->optionalStringValue();

    $expected = "value";
    
    expect($output)->toEqual($expected);
  });
});

describe('Querying a missing optional string value from a field', function() {
  it('produces the expected result', function() {
    $input = "field:";

    $output = Enolib\Parser::parse($input)->field('field')->optionalStringValue();

    expect($output)->toBeNull();
  });
});