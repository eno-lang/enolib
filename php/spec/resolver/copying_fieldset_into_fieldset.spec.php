<?php declare(strict_types=1);

use Eno\Parser;

describe('Resolution', function() {
  describe('Copying fieldset into fieldset', function() {
    given('input', function() {
      return <<<DOC
languages:
eno = error notation
json = json object notation

copy < languages
eno = eno notation
DOC;
    });

    it('works as specified', function() {
      $document = Parser::parse($this->input);

      expect($document->raw())->toMatchSnapshot('spec/resolver/snapshots/copying_fieldset_into_fieldset.snap.json');
    });
  });
});
