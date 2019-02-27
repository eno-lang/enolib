<?php declare(strict_types=1);

require_once(__DIR__ . '/util.php');

describe('Field tokenization', function() {
  given('input', function() {
    return <<<DOC
field: value
field:    value
field    : value
    field    :    value
DOC;
  });

  it('works as specified', function() {
    $instructions = inspectTokenization($this->input);

    expect($instructions)->toMatchSnapshot('spec/tokenizer/snapshots/field.snap.json');
  });
});
