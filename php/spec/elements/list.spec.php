<?php declare(strict_types=1);

use Eno\{Field, ListElement, Section};

describe('List', function() {
  beforeAll(function() {
    $this->_context = (object) [];
    $this->instruction = (object) [
      'key' => 'languages',
      'subinstructions' => [(object) [
        'key' => 'languages',
        'subinstructions' => [],
        'type' => 'LIST_ITEM',
        'value' => 'eno'
      ], (object) [
        'key' => 'languages',
        'subinstructions' => [],
        'type' => 'LIST_ITEM',
        'value' => 'json'
      ], (object) [
        'key' => 'languages',
        'subinstructions' => [],
        'type' => 'LIST_ITEM',
        'value' => 'yaml'
      ]]
    ];
    $this->section_instruction = (object) [
      'depth' => 0,
      'key' => 'mock',
      'subinstructions' => []
    ];
    $this->parent = new Section($this->_context, $this->section_instruction);
  });

  beforeEach(function() {
    $this->list = new ListElement($this->_context, $this->instruction, $this->parent);
  });

  it('is untouched after initialization', function() {
    expect($this->list->touched)->toBe(false);
  });

  it('has only untouched items after initialization', function() {
    foreach($this->list->elements() as $item) {
      expect($item->touched)->toBe(false);
    }
  });

  describe('elements()', function() {
    beforeEach(function() {
      $this->result = $this->list->elements();
    });

    it('touches the list itself', function() {
      expect($this->list->touched)->toBe(true);
    });

    it('does not touch the list items', function() {
      foreach($this->list->items([ 'elements' => true ]) as $item) {
        expect($item->touched)->toBe(false);
      }
    });
  });

  describe('items()', function() {
    describe('without a loader', function() {
      beforeEach(function() {
        $this->result = $this->list->items();
      });

      it('returns the values', function() {
        expect($this->result)->toEqual(['eno', 'json', 'yaml']);
      });

      it('touches the list itself', function() {
        expect($this->list->touched)->toBe(true);
      });

      it('touches all list items', function() {
        foreach($this->list->elements() as $item) {
          expect($item->touched)->toBe(true);
        }
      });
    });

    describe('with a loader', function() {
      beforeEach(function() {
        $this->result = $this->list->items(function($value) { return strtoupper($value); });
      });

      it('returns the processed values', function() {
        expect($this->result)->toEqual(['ENO', 'JSON', 'YAML']);
      });

      it('touches the element', function() {
        expect($this->list->touched)->toBe(true);
      });

      it('touches all list items', function() {
        foreach($this->list->elements() as $item) {
          expect($item->touched)->toBe(true);
        }
      });
    });

    describe("with [ 'with_elements' => true ]", function() {
      beforeEach(function() {
        $this->result = $this->list->items([ 'with_elements' => true ]);
      });

      it('returns the elements', function() {
        foreach($this->result as $item) {
          expect($item['element'])->toBeAnInstanceOf('Eno\\Field');
        }
      });

      it('returns the values', function() {
        expect(array_map(function($item) { return $item['value']; }, $this->result))->toEqual(['eno', 'json', 'yaml']);
      });
    });
  });

  describe('length()', function() {
    it('returns the number of items', function() {
      expect($this->list->length())->toBe(3);
    });
  });

  describe('raw()', function() {
    it('returns a native object representation', function() {
      expect($this->list->raw())->toEqual([ 'languages' => ['eno', 'json', 'yaml'] ]);
    });
  });

  describe('__toString()', function() {
    it('returns a debug abstraction', function() {
      expect((string)$this->list)->toEqual('[List key="languages" items=3]');
    });
  });

  describe('touch()', function() {
    describe('without options', function() {
      beforeEach(function() {
        $this->list->touch();
      });

      it('touches the list itself', function() {
        expect($this->list->touched)->toBe(true);
      });

      it('does not touch the list items', function() {
        foreach($this->list->elements() as $item) {
          expect($item->touched)->toBe(false);
        }
      });
    });

    describe('with { items: true }', function() {
      beforeEach(function() {
        $this->list->touch([ 'items' => true ]);
      });

      it('touches the list itself', function() {
        expect($this->list->touched)->toBe(true);
      });

      it('touches the list items', function() {
        foreach($this->list->elements() as $item) {
          expect($item->touched)->toBe(true);
        }
      });
    });
  });
});
