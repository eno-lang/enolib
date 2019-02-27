<?php declare(strict_types=1);

require_once(__DIR__ . '/util.php');

describe('Block tokenization', function() {
  given('input', function() {
    return <<<DOC
-- multiline_field
value
-- multiline_field

--    multiline_field

value

    -- multiline_field

    --    multiline_field
value

    value
        -- multiline_field
DOC;
  });

  it('works as specified', function() {
    $instructions = inspectTokenization($this->input);

    expect($instructions)->toMatchSnapshot('spec/tokenizer/snapshots/multiline_field.snap.json');
  });
});
