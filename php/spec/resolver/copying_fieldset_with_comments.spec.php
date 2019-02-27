<?php declare(strict_types=1);

use Eno\Parser;

describe('Resolution', function() {
  describe('Copying fieldset with comments', function() {
    given('input', function() {
      return <<<DOC
languages:
> eno-lang.org
eno = error notation
> json.org
json = json object notation

copy < languages
> yaml.org
yaml = yaml ain't markup language
DOC;
    });

    it('works as specified', function() {
      $document = Parser::parse($this->input);

      expect($document->raw())->toMatchSnapshot('spec/resolver/snapshots/copying_fieldset_with_comments.snap.json');
    });
  });
});
