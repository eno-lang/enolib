<?php declare(strict_types=1);

use Eno\Parser;

describe('Resolution', function() {
  describe('Copying list into name', function() {
    given('input', function() {
      return <<<DOC
languages:
- eno
- json

copy < languages
DOC;
    });

    it('works as specified', function() {
      $document = Parser::parse($this->input);

      expect($document->raw())->toMatchSnapshot('spec/resolver/snapshots/copying_list_into_name.snap.json');
    });
  });
});
