<?php declare(strict_types=1);

use Eno\Parser;

describe('Resolution', function() {
  describe('Copying fieldset into name', function() {
    given('input', function() {
      return <<<DOC
languages:
eno = eno notation
json = json object notation

copy < languages
DOC;
    });

    it('works as specified', function() {
      $document = Parser::parse($this->input);

      expect($document->raw())->toMatchSnapshot('spec/resolver/snapshots/copying_fieldset_into_name.snap.json');
    });
  });
});
