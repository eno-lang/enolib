<?php declare(strict_types=1);

require_once(__DIR__ . '/util.php');

describe('Section tokenization', function() {
  given('input', function() {
    return <<<DOC
# section
    ## section
###    section
    ####    section
DOC;
  });

  it('works as specified', function() {
    $instructions = inspectTokenization($this->input);

    expect($instructions)->toMatchSnapshot('spec/tokenizer/snapshots/section.snap.json');
  });
});
