<?php declare(strict_types=1);

use Eno\Parser;

describe('Loader bootstrapping', function() {
  beforeAll(function() {
    $input = <<<DOC
colors:
- #ff0000
- #00ff00
- #0000ff

email: jane.doe@eno-lang.org

ratings:
excellent = 1
fine = 2
ok = 3

url:
|
DOC;

    $this->document = Parser::parse($input);
  });

  describe('Fieldset', function() {
    beforeEach(function() {
      $this->ratings = $this->document->fieldset('ratings');
    });

    it('bootstraps loaders as entry proxy methods', function() {
      expect($this->ratings->number('excellent'))->toBe(1);
    });

    describe('with optional arguments', function() {
      it('passes them on', function() {
        $this->result = $this->ratings->number('excellent', [ 'with_element' => true ]);

        expect($this->result['element'])->toBeAnInstanceOf('Eno\\Field');
        expect($this->result['value'])->toBe(1);
      });
    });
  });

  describe('List', function() {
    beforeEach(function() {
      $this->color_list = $this->document->element('colors');
    });

    it('bootstraps loaders as *Items proxy methods', function() {
      expect($this->color_list->colorItems())->toEqual(['#ff0000', '#00ff00', '#0000ff']);
    });

    describe('with optional arguments', function() {
      it('passes them on', function() {
        $items = $this->color_list->colorItems([ 'with_elements' => true ]);

        foreach($items as $item) {
          expect($item['element'])->toBeAnInstanceOf('Eno\\Field');
          expect($item['value'])->toBeA('string');
        }
      });
    });
  });

  describe('Section', function() {
    describe('Loaders as field proxy methods', function() {
      it('bootstraps them', function() {
        expect($this->document->email('email'))->toEqual('jane.doe@eno-lang.org');
      });

      describe('with optional arguments', function() {
        it('passes them on', function() {
          $this->result = $this->document->email('email', [ 'with_element' => true ]);

          expect($this->result['element'])->toBeAnInstanceOf('Eno\\Field');
          expect($this->result['value'])->toEqual('jane.doe@eno-lang.org');
        });
      });
    });

    describe('Loaders as *List proxy methods', function() {
      it('bootstraps them', function() {
        expect($this->document->colorList('colors'))->toEqual(['#ff0000', '#00ff00', '#0000ff']);
      });

      describe('with optional arguments', function() {
        it('passes them on', function() {
          $items = $this->document->colorList('colors', [ 'with_elements' => true ]);

          foreach($items as $item) {
            expect($item['element'])->toBeAnInstanceOf('Eno\\Field');
            expect($item['value'])->toBeA('string');
          }
        });
      });
    });
  });

  describe('Field', function() {
    beforeEach(function() {
      $this->email_field = $this->document->element('email');
    });

    it('bootstraps loaders as value proxy methods', function() {
      expect($this->email_field->email())->toEqual('jane.doe@eno-lang.org');
    });

    describe('with optional arguments', function() {
      it('passes them on', function() {

        $error = interceptValidationError(function() {
          $url_field = $this->document->element('url');
          $url_field->url([ 'required' => true ]);
        });

        expect($error)->toMatchErrorSnapshot('spec/loaders/snapshots/bootstrapping.snap.error');
      });
    });
  });
});
