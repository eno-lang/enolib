<?php declare(strict_types=1);

require_once(__DIR__ . '/util.php');

describe('Section analysis', function() {
  given('input', function() {
    return <<<DOC
# section_1 < section_2
field: value

## subsection_1 < subsection_2
field: value

# section_2 < section_1
field: value

## subsection_2 < section_1
field: value
DOC;
  });

  it('works as specified', function() {
    $instructions = inspectAnalysis($this->input);

    expect($instructions)->toMatchSnapshot('spec/analyzer/snapshots/sections.snap.json');
  });
});
