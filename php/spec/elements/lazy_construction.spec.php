<?php declare(strict_types=1);

use Eno\{Field, Fieldset, ListElement, Parser};

describe('Fetching an empty element through fieldset()', function() {
  beforeEach(function() {
    $this->document = Parser::parse('languages:');
    $this->fieldset = $this->document->fieldset('languages');
  });

  it('returns a fieldset', function() {
    expect($this->fieldset)->toBeAnInstanceOf('Eno\\Fieldset');
  });

  it('returns a fieldset with enforceAllElements disabled', function() {
    expect($this->fieldset->enforce_all_elements)->toBe(false);
  });

  describe('when enforceAllElements was called on the document', function() {
    beforeEach(function() {
      $this->document->enforceAllElements();
      $this->fieldset = $this->document->fieldset('languages');
    });

    it('returns a fieldset with enforceAllElements enabled', function() {
      expect($this->fieldset->enforce_all_elements)->toBe(true);
    });
  });
});

describe('Fetching an empty element through fieldsets()', function() {
  $this->document = Parser::parse('languages:');
  $this->fieldsets = $this->document->fieldsets('languages');

  it('returns one element', function() {
    expect(count($this->fieldsets))->toBe(1);
  });

  it('returns a fieldset as first element', function() {
    expect($this->fieldsets[0])->toBeAnInstanceOf('Eno\\Fieldset');
  });

  it('returns a fieldset with enforceAllElements disabled', function() {
    expect($this->fieldsets[0]->enforce_all_elements)->toBe(false);
  });

  describe('when enforceAllElements was enabled on the $this->document', function() {
    $this->document->enforceAllElements();
    $this->fieldsets = $this->document->fieldsets('languages');

    it('returns a fieldset with enforceAllElements enabled', function() {
      expect($this->fieldsets[0]->enforce_all_elements)->toBe(true);
    });
  });
});

describe('Fetching an empty element through fields()', function() {
  $this->document = Parser::parse('languages:');
  $this->fields = $this->document->fields('languages');

  it('returns one element', function() {
    expect(count($this->fields))->toBe(1);
  });

  it('returns a field as first element', function() {
    expect($this->fields[0])->toBeAnInstanceOf('Eno\\Field');
  });
});

describe('Fetching an empty element through lists()', function() {
  $this->document = Parser::parse('languages:');
  $this->lists = $this->document->lists('languages');

  it('returns one element', function() {
    expect(count($this->lists))->toBe(1);
  });

  it('returns a list as first element', function() {
    expect($this->lists[0])->toBeAnInstanceOf('Eno\\ListElement');
  });
});
