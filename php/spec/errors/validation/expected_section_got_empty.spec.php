<?php declare(strict_types=1);

use Eno\{Parser};

describe('Validation::expectedSectionGotEmpty', function() {
  beforeAll(function() {
    $this->error = interceptValidationError(function() {
      $input = <<<DOC
languages:
DOC;

      $document = Parser::parse($input);
      $document->section('languages');
    });
  });

  it('throws the expected error', function() {
    expect($this->error)->toMatchErrorSnapshot('spec/errors/validation/snapshots/expected_section_got_empty.snap.error');
  });
});
