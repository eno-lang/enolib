<?php declare(strict_types=1);

require_once(__DIR__ . '/util.php');

describe('Escaped fieldset entry tokenization', function() {
  given('input', function() {
    return <<<DOC
`key` =
``ke`y`` =
```k``ey```    =
    `` `key` ``    =
DOC;
  });

  it('works as specified', function() {
    $instructions = inspectTokenization($this->input);

    expect($instructions)->toMatchSnapshot('spec/tokenizer/snapshots/escaped_fieldset_entry.snap.json');
  });
});
