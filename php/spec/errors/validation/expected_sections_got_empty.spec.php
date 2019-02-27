<?php declare(strict_types=1);

use Eno\{Parser};

describe('Validation::expectedSectionsGotEmpty', function() {
  beforeAll(function() {
    $this->error = interceptValidationError(function() {
      $input = <<<DOC
languages:
DOC;

      $document = Parser::parse($input);
      $document->sections('languages');
    });
  });

  it('throws the expected error', function() {
    expect($this->error)->toMatchErrorSnapshot('spec/errors/validation/snapshots/expected_sections_got_empty.snap.error');
  });
});
