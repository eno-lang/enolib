<?php declare(strict_types=1);

require_once(__DIR__ . '/util.php');

describe('Fieldset entry tokenization', function() {
  given('input', function() {
    return <<<DOC
entry = value
entry    = value
    entry = value
    entry    = value
    entry    =    value
DOC;
  });

  it('works as specified', function() {
    $instructions = inspectTokenization($this->input);

    expect($instructions)->toMatchSnapshot('spec/tokenizer/snapshots/fieldset_entry.snap.json');
  });
});
