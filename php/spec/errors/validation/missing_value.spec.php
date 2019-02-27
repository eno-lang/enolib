<?php declare(strict_types=1);

use Eno\{Parser};

describe('Validation::missingValue', function() {
  describe('missingFieldsetEntryValue', function() {
    beforeAll(function() {
      $this->error = interceptValidationError(function() {
        $input = <<<DOC
fieldset:
required =
DOC;

        $document = Parser::parse($input);
        $document->fieldset('fieldset')->entry('required', [ 'required' => true ]);
      });
    });

    it('provides a correct error', function() {
      expect($this->error)->toMatchErrorSnapshot('spec/errors/validation/snapshots/missing_value_missing_fieldset_entry_value.snap.error');
    });
  });

  describe('missingFieldValue', function() {
    describe('without empty line continuations', function() {
      beforeAll(function() {
        $this->error = interceptValidationError(function() {
          $input = <<<DOC
required:
DOC;

          $document = Parser::parse($input);
          $document->field('required', [ 'required' => true ]);
        });
      });

      it('provides a correct error', function() {
        expect($this->error)->toMatchErrorSnapshot('spec/errors/validation/snapshots/missing_value_missing_field_value_without_empty_line_continuations.snap.error');
      });
    });

    describe('with empty line continuations', function() {
      beforeAll(function() {
        $this->error = interceptValidationError(function() {
          $input = <<<DOC
required:
|

|
DOC;

          $document = Parser::parse($input);
          $document->field('required', [ 'required' => true ]);
        });
      });

      it('provides a correct error', function() {
        expect($this->error)->toMatchErrorSnapshot('spec/errors/validation/snapshots/missing_value_missing_field_value_with_empty_line_continuations.snap.error');
      });
    });
  });

  describe('missingListItemValue', function() {
    beforeAll(function() {
      $this->error = interceptValidationError(function() {
        $input = <<<DOC
values required:
- value
-
DOC;

        $document = Parser::parse($input);
        $document->list('values required'); // [ 'enforce_values' => true ] is default
      });
    });

    it('provides a correct error', function() {
      expect($this->error)->toMatchErrorSnapshot('spec/errors/validation/snapshots/missing_value_missing_list_item_value.snap.error');
    });
  });
});
