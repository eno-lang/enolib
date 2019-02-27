<?php declare(strict_types=1);

use Eno\{Parser};

describe('Validation::expectedElementGotElements', function() {
  beforeAll(function() {
    $this->error = interceptValidationError(function() {
      $input = <<<DOC
language: eno
language: json
DOC;

      $document = Parser::parse($input);
      $document->element('language');
    });
  });

  it('throws the expected error', function() {
    expect($this->error)->toMatchErrorSnapshot('spec/errors/validation/snapshots/expected_element_got_elements.snap.error');
  });
});
