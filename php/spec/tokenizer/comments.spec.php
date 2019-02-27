<?php declare(strict_types=1);

require_once(__DIR__ . '/util.php');

describe('Comment tokenization', function() {
  given('input', function() {
    return <<<DOC
> note
> more notes
    >    note
    >
DOC;
  });

  it('works as specified', function() {
    $instructions = inspectTokenization($this->input);

    expect($instructions)->toMatchSnapshot('spec/tokenizer/snapshots/comment.snap.json');
  });
});
