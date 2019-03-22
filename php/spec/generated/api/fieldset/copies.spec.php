<?php declare(strict_types=1);

describe('Querying four entries from a fieldset, all of them copied from another fieldset', function() {
  it('produces the expected result', function() {
    $input = "fieldset:\n" .
             "1 = 1\n" .
             "2 = 2\n" .
             "3 = 3\n" .
             "4 = 4\n" .
             "\n" .
             "copy < fieldset";

    $output = array_map(
      function($entry) { return $entry->requiredStringValue(); },
      Enolib\Parser::parse($input)->fieldset('copy')->entries()
    );

    expect($output)->toEqual(['1', '2', '3', '4']);
  });
});

describe('Querying four entries from a fieldset, two of them copied from another fieldset', function() {
  it('produces the expected result', function() {
    $input = "fieldset:\n" .
             "1 = 1\n" .
             "2 = 2\n" .
             "\n" .
             "copy < fieldset\n" .
             "3 = 3\n" .
             "4 = 4";

    $output = array_map(
      function($entry) { return $entry->requiredStringValue(); },
      Enolib\Parser::parse($input)->fieldset('copy')->entries()
    );

    expect($output)->toEqual(['1', '2', '3', '4']);
  });
});

describe('Querying three entries from a fieldset, one owned, one replaced, one copied', function() {
  it('produces the expected result', function() {
    $input = "fieldset:\n" .
             "1 = 1\n" .
             "2 = 0\n" .
             "\n" .
             "copy < fieldset\n" .
             "2 = 2\n" .
             "3 = 3";

    $output = array_map(
      function($entry) { return $entry->requiredStringValue(); },
      Enolib\Parser::parse($input)->fieldset('copy')->entries()
    );

    expect($output)->toEqual(['1', '2', '3']);
  });
});