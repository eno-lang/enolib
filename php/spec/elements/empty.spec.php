<?php declare(strict_types=1);

use Eno\{EmptyElement, Section};

describe('EmptyElement', function() {
  beforeAll(function() {
    $this->_context = (object) [];
    $this->instruction = (object) [ 'key' => 'language' ];
    $this->section_instruction = (object) [
      'depth' => 0,
      'key' => 'mock',
      'subinstructions' => []
    ];
    $this->parent = new Section($this->_context, $this->section_instruction);
  });

  beforeEach(function() {
    $this->empty = new EmptyElement($this->_context, $this->instruction, $this->parent);
  });

  it('is untouched after initialization', function() {
    expect($this->empty->touched)->toBe(false);
  });

  describe('raw()', function() {
    it('returns a native object representation', function() {
      expect($this->empty->raw())->toEqual([ 'language' => null ]);
    });
  });

  describe('__toString()', function() {
    it('returns a debug representation', function() {
      expect((string)$this->empty)->toEqual('[EmptyElement key="language"]');
    });
  });

  describe('touch()', function() {
    it('touches the element', function() {
      $this->empty->touch();
      expect($this->empty->touched)->toBe(true);
    });
  });

  describe('value()', function() {
    beforeEach(function() {
      $this->value = $this->empty->value();
    });

    it('returns null', function() {
      expect($this->value)->toBe(null);
    });

    it('touches the element', function() {
      expect($this->empty->touched)->toBe(true);
    });
  });
});
