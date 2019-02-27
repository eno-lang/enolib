<?php declare(strict_types=1);

use Eno\{Parser};

describe('Validation::expectedFieldGotFields', function() {
  beforeAll(function() {
    $this->error = interceptValidationError(function() {
      $input = <<<DOC
language: eno
language: json
DOC;

      $document = Parser::parse($input);
      $document->field('language');
    });
  });

  it('throws the expected error', function() {
    expect($this->error)->toMatchErrorSnapshot('spec/errors/validation/snapshots/expected_field_got_fields.snap.error');
  });
});
