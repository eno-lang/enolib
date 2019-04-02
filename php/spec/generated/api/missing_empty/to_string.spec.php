<?php declare(strict_types=1);

describe('A missing empty queried without a key leaves out the key in the debug string representation', function() {
  it('produces the expected result', function() {
    $input = "";

    $output = Enolib\Parser::parse($input)->empty()->toString();

    expect($output)->toEqual('[MissingEmpty]');
  });
});

describe('A missing empty queried with a key includes the key in the debug string representation', function() {
  it('produces the expected result', function() {
    $input = "";

    $output = Enolib\Parser::parse($input)->empty('key')->toString();

    expect($output)->toEqual('[MissingEmpty key=key]');
  });
});