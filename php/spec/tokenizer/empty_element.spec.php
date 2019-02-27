<?php declare(strict_types=1);

require_once(__DIR__ . '/util.php');

describe('Empty element tokenization', function() {
  given('input', function() {
    return <<<DOC
element:
    element:
element    :
    element    :
DOC;
  });

  it('works as specified', function() {
    $instructions = inspectTokenization($this->input);

    expect($instructions)->toMatchSnapshot('spec/tokenizer/snapshots/empty_element.snap.json');
  });
});
