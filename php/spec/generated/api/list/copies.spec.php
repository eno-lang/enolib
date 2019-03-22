<?php declare(strict_types=1);

describe('Querying four items from a list, all of them copied from another list', function() {
  it('produces the expected result', function() {
    $input = "list:\n" .
             "- 1\n" .
             "- 2\n" .
             "- 3\n" .
             "- 4\n" .
             "\n" .
             "copy < list";

    $output = Enolib\Parser::parse($input)->list('copy')->requiredStringValues();

    expect($output)->toEqual(['1', '2', '3', '4']);
  });
});

describe('Querying four items from a list, two of them copied from another list', function() {
  it('produces the expected result', function() {
    $input = "list:\n" .
             "- 1\n" .
             "- 2\n" .
             "\n" .
             "copy < list\n" .
             "- 3\n" .
             "- 4";

    $output = Enolib\Parser::parse($input)->list('copy')->requiredStringValues();

    expect($output)->toEqual(['1', '2', '3', '4']);
  });
});