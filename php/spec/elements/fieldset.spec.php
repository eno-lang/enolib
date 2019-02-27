<?php declare(strict_types=1);

use Eno\{Field, Fieldset, Parser, Section};

describe('Fieldset', function() {
  beforeAll(function() {
    $this->_context = (object) [];
    $this->instruction = (object) [
      'key' => 'languages',
      'subinstructions' => [(object) [
        'type' => 'NOOP'
      ], (object) [
        'key' => 'eno',
        'subinstructions' => [],
        'type' => 'FIELDSET_ENTRY',
        'value' => 'eno notation'
      ], (object) [
        'key' => 'json',
        'subinstructions' => [],
        'type' => 'FIELDSET_ENTRY',
        'value' => 'JavaScript Object Notation'
      ], (object) [
        'key' => 'yaml',
        'subinstructions' => [],
        'type' => 'FIELDSET_ENTRY',
        'value' => "YAML Ain't Markup Language"
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
    $this->fieldset = new Fieldset($this->_context, $this->instruction, $this->parent);
  });

  it('is untouched after initialization', function() {
    expect($this->fieldset->touched)->toBe(false);
  });

  it('has only untouched entries after initialization', function() {
    foreach($this->fieldset->entries() as $entry) {
      expect($entry->touched)->toBe(false);
    }
  });

  it('has enforceAllElements disabled by default', function() {
    expect($this->fieldset->enforce_all_elements)->toBe(false);
  });

  describe('element()', function() {
    describe('fetching an existing element', function() {
      beforeEach(function() {
        $this->result = $this->fieldset->element('eno');
      });

      it('returns an element', function() {
        expect($this->result)->toBeAnInstanceOf('Eno\\Field');
      });

      it('returns the right element', function() {
        expect($this->result->name)->toEqual('eno');
      });
    });

    describe('fetching a missing element', function() {
      it('throws an error', function() {
        $error = interceptValidationError(function() {
          Parser::parse('languages:')->fieldset('languages')->element('missing');
        });

        expect($error)->toMatchErrorSnapshot('spec/elements/snapshots/fieldset_element_fetching_a_missing_element.snap.error');
      });

      describe("with [ 'enforce_element' => false ]", function() {
        it('returns null', function() {
          expect($this->fieldset->element('missing', [ 'enforce_element' => false ]))->toBeNull();
        });
      });

      describe("with [ 'required' => false ]", function() {
        it('returns null', function() {
          expect($this->fieldset->element('missing', [ 'required' => false ]))->toBeNull();
        });
      });
    });
  });

  describe('enforceAllElements()', function() {
    it('sets the enforce_all_elements property to true', function() {
      $this->fieldset->enforceAllElements();
      expect($this->fieldset->enforce_all_elements)->toBe(true);
    });

    describe('passing true explicitly', function() {
      it('sets the enforce_all_elements property to true', function() {
        $this->fieldset->enforceAllElements(true);
        expect($this->fieldset->enforce_all_elements)->toBe(true);
      });
    });

    describe('passing false explicitly', function() {
      it('sets the enforce_all_elements property back to false', function() {
        $this->fieldset->enforceAllElements(true);
        $this->fieldset->enforceAllElements(false);
        expect($this->fieldset->enforce_all_elements)->toBe(false);
      });
    });
  });

  describe('entry()', function() {
    describe('without a loader', function() {
      beforeEach(function() {
        $this->result = $this->fieldset->entry('eno');
      });

      it('returns a value', function() {
        expect($this->result)->toEqual('eno notation');
      });

      it('touches the fieldset', function() {
        expect($this->fieldset->touched)->toBe(true);
      });

      it('touches the entry', function() {
        expect($this->fieldset->entries_associative['eno']->touched)->toBe(true);
      });

      it('does not touch the other entries', function() {
        foreach($this->fieldset->entries() as $entry) {
          if($entry->name != 'eno') {
            expect($entry->touched)->toBe(false);
          }
        }
      });
    });

    describe('with a loader', function() {
      beforeEach(function() {
        $this->result =  $this->fieldset->entry('eno', function($value) { return strtoupper($value); });
      });

      it('applies the loader', function() {
        expect($this->result)->toEqual('ENO NOTATION');
      });

      it('touches the element', function() {
        expect($this->fieldset->touched)->toBe(true);
      });

      it('touches the entry', function() {
        expect($this->fieldset->entries_associative['eno']->touched)->toBe(true);
      });

      it('does not touch the other entries', function() {
        foreach($this->fieldset->entries() as $entry) {
          if($entry->name != 'eno') {
            expect($entry->touched)->toBe(false);
          }
        }
      });
    });

    describe("with [ 'element' => true ]", function() {
      it('returns the element', function() {
        $this->result = $this->fieldset->entry('eno', [ 'element' => true ]);
        expect($this->result)->toBeAnInstanceOf('Eno\\Field');
      });
    });

    describe("with [ 'with_element' => true ]", function() {
      describe('when the entry exists', function() {
        beforeEach(function() {
          $this->result = $this->fieldset->entry('eno', [ 'with_element' => true ]);
        });

        it('returns the element', function() {
          expect($this->result['element'])->toBeAnInstanceOf('Eno\\Field');
        });

        it('returns the value', function() {
          expect($this->result['value'])->toEqual('eno notation');
        });
      });

      describe('when the entry does not exist', function() {
        beforeEach(function() {
          $this->result = $this->fieldset->entry('missing', [ 'with_element' => true ]);
        });

        it('returns the element', function() {
          expect($this->result['element'])->toBe(null);
        });

        it('returns the value', function() {
          expect($this->result['value'])->toBe(null);
        });
      });
    });
  });

  describe('raw()', function() {
    it('returns a native object representation', function() {
      expect($this->fieldset->raw())->toEqual([
        'languages' => [
          [ 'eno' => 'eno notation' ],
          [ 'json' => 'JavaScript Object Notation' ],
          [ 'yaml' => "YAML Ain't Markup Language" ]
        ]
      ]);
    });
  });

  describe('toString()', function() {
    it('returns a debug abstraction', function() {
      expect((string)$this->fieldset)->toEqual('[Fieldset key="languages" entries=3]');
    });
  });

  describe('touch()', function() {
    describe('without options', function() {
      beforeEach(function() {
        $this->fieldset->touch();
      });

      it('touches the fieldset', function() {
        expect($this->fieldset->touched)->toBe(true);
      });

      it('does not touch the entries', function() {
        foreach($this->fieldset->entries() as $entry) {
          expect($entry->touched)->toBe(false);
        }
      });
    });

    describe('with { entries: true }', function() {
      beforeEach(function() {
        $this->fieldset->touch([ 'entries' => true ]);
      });

      it('touches the fieldset', function() {
        expect($this->fieldset->touched)->toBe(true);
      });

      it('touches the entries', function() {
        foreach($this->fieldset->entries() as $entry) {
          expect($entry->touched)->toBe(true);
        }
      });
    });
  });
});
