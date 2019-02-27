<?php declare(strict_types=1);

use Eno\{Field, Section};

describe('Section', function() {
  beforeAll(function() {
    $this->_context = (object) [];
    $this->instruction = (object) [
      'depth' => 0,
      'index' => 0,
      'length' => 0,
      'line' => 0,
      'ranges' => [
        'section_operator' => [0, 0],
        'key' => [0, 0]
      ],
      'subinstructions' => [
        (object) [
          'key' => 'eno',
          'subinstructions' => [],
          'type' => 'FIELD',
          'value' => 'eno notation'
        ],
        (object) [
          'key' => 'json',
          'subinstructions' => [],
          'type' => 'FIELD',
          'value' => 'JavaScript Object Notation'
        ],
        (object) [
          'key' => 'yaml',
          'subinstructions' => [],
          'type' => 'FIELD',
          'value' => "YAML Ain't Markup Language"
        ]
      ]
    ];
  });

  beforeEach(function() {
    $this->section = new Section($this->_context, $this->instruction);
  });

  it('is untouched after initialization', function() {
    expect($this->section->touched)->toBe(false);
  });

  it('has only untouched entries after initialization', function() {
    foreach($this->section->elements as $element) {
      expect($element->touched)->toBe(false);
    }
  });

  it('has enforce_all_elements disabled by default', function() {
    expect($this->section->enforce_all_elements)->toBe(false);
  });

  describe('__toString()', function() {
    it('returns a debug abstraction', function() {
      expect((string)$this->section)->toEqual('[Section document elements=3]');
    });
  });

  describe('elements()', function() {
    beforeEach(function() {
      $this->result = $this->section->elements();
    });

    it('touches the section', function() {
      expect($this->section->touched)->toBe(true);
    });

    it('returns the correct number of elements', function() {
      expect(count($this->result))->toEqual(3);
    });

    it('returns the elements of the section', function() {
      foreach($this->result as $element) {
        expect($element)->toBeAnInstanceOf('Eno\\Field');
      }
    });
  });

  describe('raw()', function() {
    it('returns a native representation', function() {
      expect($this->section->raw())->toEqual([
        [ 'eno' => 'eno notation' ],
        [ 'json' => 'JavaScript Object Notation' ],
        [ 'yaml' => "YAML Ain't Markup Language" ]
      ]);
    });
  });

  describe('touch()', function() {
    it('touches the element', function() {
      $this->section->touch();
      expect($this->section->touched)->toBe(true);
    });
  });
});
