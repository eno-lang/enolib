<?php declare(strict_types=1);

use Eno\{Parser};

describe('Validation::expectedListsGotField', function() {
  beforeAll(function() {
    $this->error = interceptValidationError(function() {
      $input = <<<DOC
languages:
| eno (eno notation)
| yaml (yaml ain't markup language)

languages:
| json (javascript object notation)
| cson (coffeescript object notation)
DOC;

      $document = Parser::parse($input);
      $document->lists('languages');
    });
  });

  it('throws the expected error', function() {
    expect($this->error)->toMatchErrorSnapshot('spec/errors/validation/snapshots/expected_lists_got_field.snap.error');
  });
});
