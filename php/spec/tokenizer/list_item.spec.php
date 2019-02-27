<?php declare(strict_types=1);

require_once(__DIR__ . '/util.php');

describe('List item tokenization', function() {
  given('input', function() {
    return <<<DOC
- item
    -    item
        - item
        -    item
    - item
DOC;
  });

  it('works as specified', function() {
    $instructions = inspectTokenization($this->input);

    expect($instructions)->toMatchSnapshot('spec/tokenizer/snapshots/list_item.snap.json');
  });
});
