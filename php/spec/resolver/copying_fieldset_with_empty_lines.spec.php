<?php declare(strict_types=1);

use Eno\Parser;

describe('Resolution', function() {
  describe('Copying fieldset with empty lines', function() {
    given('input', function() {
      return <<<DOC
languages:

eno = error notation

json = json object notation

copy < languages

yaml = yaml ain't markup language
DOC;
    });

    it('works as specified', function() {
      $document = Parser::parse($this->input);

      expect($document->raw())->toMatchSnapshot('spec/resolver/snapshots/copying_fieldset_with_empty_lines.snap.json');
    });
  });
});
