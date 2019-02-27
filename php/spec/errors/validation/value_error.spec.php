<?php declare(strict_types=1);

use Eno\{Parser};

describe('Validation::valueError', function() {
  describe('calling error on an empty element', function() {
    beforeEach(function() {
      $document = Parser::parse('language:');
      $this->empty = $document->element('language');
    });

    it('returns the right error', function() {
      $error = $this->empty->error();
      expect($error)->toMatchErrorSnapshot('spec/errors/validation/snapshots/value_error_on_empty.snap.error');
    });

    describe('providing a custom message', function() {
      it('returns the right error', function() {
        $error = $this->empty->error('a highly custom error');
        expect($error)->toMatchErrorSnapshot('spec/errors/validation/snapshots/value_error_on_empty_with_message.snap.error');
      });
    });

    describe('providing an error function', function() {
      it('returns the right error', function() {
        $error = $this->empty->error(function($name, $value) {
          if($value === null) {
            return "{$name} can not be null";
          } else {
            throw new Exception('Error must be null here');
          }
        });
        expect($error)->toMatchErrorSnapshot('spec/errors/validation/snapshots/value_error_on_empty_with_message_closure.snap.error');
      });
    });
  });
});
