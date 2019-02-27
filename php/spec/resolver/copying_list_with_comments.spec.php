<?php declare(strict_types=1);

use Eno\Parser;

describe('Resolution', function() {
  describe('Copying list with comments', function() {
    given('input', function() {
      return <<<DOC
languages:
> eno-lang.org
- eno
> json.org
- json

copy < languages
> yaml.org
- yaml
DOC;
    });

    it('works as specified', function() {
      $document = Parser::parse($this->input);

      expect($document->raw())->toMatchSnapshot('spec/resolver/snapshots/copying_list_with_comments.snap.json');
    });
  });
});
