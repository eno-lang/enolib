<?php declare(strict_types=1);

require_once(__DIR__ . '/util.php');

describe('Escaped copy tokenization', function() {
  given('input', function() {
    return <<<DOC
`key` < template
``ke`y`` < template
```k``ey```    < template
    `` `key` ``    < template
DOC;
  });

  it('works as specified', function() {
    $instructions = inspectTokenization($this->input);

    expect($instructions)->toMatchSnapshot('spec/tokenizer/snapshots/escaped_copy.snap.json');
  });
});
