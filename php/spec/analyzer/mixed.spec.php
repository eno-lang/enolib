<?php declare(strict_types=1);

require_once(__DIR__ . '/util.php');

describe('Mixed analysis', function() {
  given('input', function() {
    return <<<DOC
color: cyan
close:up
# notes
-- long
is
-- long
DOC;
  });

  it('works as specified', function() {
    $instructions = inspectAnalysis($this->input);

    expect($instructions)->toMatchSnapshot('spec/analyzer/snapshots/mixed.snap.json');
  });
});
