<?php declare(strict_types=1);

use Eno\{Parser};

describe('Validation::expectedFieldsetGotFieldsets', function() {
  beforeAll(function() {
    $this->error = interceptValidationError(function() {
      $input = <<<DOC
languages:
eno = eno notation

languages:
json = JavaScript Object Notation

languages:
yaml = YAML Ain't Markup Language
DOC;

      $document = Parser::parse($input);
      $document->fieldset('languages');
    });
  });

  it('throws the expected error', function() {
    expect($this->error)->toMatchErrorSnapshot('spec/errors/validation/snapshots/expected_fieldset_got_fieldsets.snap.error');
  });
});
