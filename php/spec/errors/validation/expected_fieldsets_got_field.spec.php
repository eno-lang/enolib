<?php declare(strict_types=1);

use Eno\{Parser};

describe('Validation::expectedFieldsetsGotField', function() {
  beforeAll(function() {
    $this->error = interceptValidationError(function() {
      $input = <<<DOC
languages:
eno = eno notation

languages:
json = JavaScript Object Notation

languages:
| yaml (YAML Ain't Markup Language)
DOC;

      $document = Parser::parse($input);
      $document->fieldsets('languages');
    });
  });

  it('throws the expected error', function() {
    expect($this->error)->toMatchErrorSnapshot('spec/errors/validation/snapshots/expected_fieldsets_got_field.snap.error');
  });
});
