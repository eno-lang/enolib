<?php declare(strict_types=1);

describe('Querying existing required string values from a list', function() {
  it('produces the expected result', function() {
    $input = "list:\n" .
             "- item\n" .
             "- item";

    $output = Enolib\Parser::parse($input)->list('list')->requiredStringValues();

    expect($output)->toEqual(['item', 'item']);
  });
});

describe('Querying existing optional string values from a list', function() {
  it('produces the expected result', function() {
    $input = "list:\n" .
             "- item\n" .
             "- item";

    $output = Enolib\Parser::parse($input)->list('list')->optionalStringValues();

    expect($output)->toEqual(['item', 'item']);
  });
});

describe('Querying missing optional string values from a list', function() {
  it('produces the expected result', function() {
    $input = "list:\n" .
             "-\n" .
             "-";

    $output = Enolib\Parser::parse($input)->list('list')->optionalStringValues();

    expect($output)->toEqual([null, null]);
  });
});