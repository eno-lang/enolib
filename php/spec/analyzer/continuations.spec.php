<?php declare(strict_types=1);

require_once(__DIR__ . '/util.php');

describe('Continuation analysis', function() {
  given('input', function() {
    return <<<DOC
Field: Value
\\ Line continuation
| Newline continuation

Fieldset:
Empty = Value
\\ Line continuation
| Newline continuation

List:
- Value
\\ Line continuation
| Newline continuation

Empty field:
\\ Line continuation
| Newline continuation

Fieldset with empty entry:
Empty entry =
\\ Line continuation
| Newline continuation

List with empty item:
-
\\ Line continuation
| Newline continuation
DOC;
  });

  it('works as specified', function() {
    $instructions = inspectAnalysis($this->input);

    expect($instructions)->toMatchSnapshot('spec/analyzer/snapshots/continuations.snap.json');
  });
});
