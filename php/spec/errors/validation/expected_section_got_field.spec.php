<?php declare(strict_types=1);

use Eno\{Parser};

describe('Validation::expectedSectionGotField', function() {
  beforeAll(function() {
    $this->error = interceptValidationError(function() {
      $input = <<<DOC
languages:
| eno (eno notation)
| json (javascript object notation)
| yaml (yaml ain't markup language)
DOC;

      $document = Parser::parse($input);
      $document->section('languages');
    });
  });

  it('throws the expected error', function() {
    expect($this->error)->toMatchErrorSnapshot('spec/errors/validation/snapshots/expected_section_got_field.snap.error');
  });
});
