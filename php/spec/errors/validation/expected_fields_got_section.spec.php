<?php declare(strict_types=1);

use Eno\{Parser};

describe('Validation::expectedFieldsGotSection', function() {
  beforeAll(function() {
    $this->error = interceptValidationError(function() {
      $input = <<<DOC
# language
eno: eno notation

# language
json: javascript object notation
DOC;

      $document = Parser::parse($input);
      $document->fields('language');
    });
  });

  it('throws the expected error', function() {
    expect($this->error)->toMatchErrorSnapshot('spec/errors/validation/snapshots/expected_fields_got_section.snap.error');
  });
});
