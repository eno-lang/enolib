<?php declare(strict_types=1);

use Eno\Parser;

describe('string alias pseudo loader', function() {
  beforeAll(function() {
    $input = <<<DOC
field: value

list:
- value
- value

fieldset:
entry = value
DOC;

    $this->document = Parser::parse($input);
  });

  describe('as List items proxy', function() {
    it('returns the values unaltered', function() {
      $values = $this->document->list('list')->requiredStringValues();

      foreach($values as $value) {
        expect($value)->toBe('value');
      }
    });
  });

  describe('as Value value proxy', function() {
    it('returns the value unaltered', function() {
      expect($this->document->field('field')->requiredStringValue())->toBe('value');
    });
  });
});
