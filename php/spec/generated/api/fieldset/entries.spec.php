<?php declare(strict_types=1);

describe('Querying all entries from a fieldset', function() {
  it('produces the expected result', function() {
    $input = "fieldset:\n" .
             "1 = 1\n" .
             "2 = 2";

    $output = array_map(
      function($entry) { return $entry->requiredStringValue(); },
      Enolib\Parser::parse($input)->fieldset('fieldset')->entries()
    );

    expect($output)->toEqual(['1', '2']);
  });
});

describe('Querying entries from a fieldset by key', function() {
  it('produces the expected result', function() {
    $input = "fieldset:\n" .
             "entry = value\n" .
             "other = one\n" .
             "other = two";

    $output = array_map(
      function($entry) { return $entry->requiredStringValue(); },
      Enolib\Parser::parse($input)->fieldset('fieldset')->entries('other')
    );

    expect($output)->toEqual(['one', 'two']);
  });
});