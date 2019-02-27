<?php declare(strict_types=1);

use Eno\{Parser};

describe('Validation::expectedFieldGotList', function() {
  beforeAll(function() {
    $this->error = interceptValidationError(function() {
      $input = <<<DOC
languages:
- eno (eno notation)
- json (javascript object notation)
DOC;

      $document = Parser::parse($input);
      $document->field('languages');
    });
  });

  it('throws the expected error', function() {
    expect($this->error)->toMatchErrorSnapshot('spec/errors/validation/snapshots/expected_field_got_list.snap.error');
  });
});
