<?php declare(strict_types=1);

use Eno\{Parser};

describe('Validation::expectedSectionGotSections', function() {
  beforeAll(function() {
    $this->error = interceptValidationError(function() {
      $input = <<<DOC
# languages
eno: eno notation

# languages
json: JavaScript Object Notation

# languages
yaml: YAML Ain't Markup Language
DOC;

      $document = Parser::parse($input);
      $document->section('languages');
    });
  });

  it('throws the expected error', function() {
    expect($this->error)->toMatchErrorSnapshot('spec/errors/validation/snapshots/expected_section_got_sections.snap.error');
  });
});
