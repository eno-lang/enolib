<?php declare(strict_types=1);

require_once(__DIR__ . '/util.php');

describe('Copy tokenization', function() {
  given('input', function() {
    return <<<DOC
copy < template
copy << template
copy    < template
copy    << template
     copy     < template
     copy     << template
DOC;
  });

  it('works as specified', function() {
    $instructions = inspectTokenization($this->input);

    expect($instructions)->toMatchSnapshot('spec/tokenizer/snapshots/copy.snap.json');
  });
});
