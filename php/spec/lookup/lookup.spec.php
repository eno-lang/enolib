<?php declare(strict_types=1);

use Eno\Parser;

const SCENARIOS = [
  [
    'arguments' => [3], # 'o'
    'element' => 'color',
    'zone' => 'key'
  ],
  [
    'arguments' => [0, 3], # 'o'
    'element' => 'color',
    'zone' => 'key'
  ],
  [
    'arguments' => [6], # ' '
    'element' => 'color',
    'zone' => 'element_operator'
  ],
  [
    'arguments' => [0, 6], # ' '
    'element' => 'color',
    'zone' => 'element_operator'
  ],
  [
    'arguments' => [7], # 'c'
    'element' => 'color',
    'zone' => 'value'
  ],
  [
    'arguments' => [0, 7], # 'c'
    'element' => 'color',
    'zone' => 'value'
  ],
  [
    'arguments' => [18], # 'u'
    'element' => 'close',
    'zone' => 'value'
  ],
  [
    'arguments' => [1, 6], # 'u'
    'element' => 'close',
    'zone' => 'value'
  ],
  [
    'arguments' => [21], # '#'
    'element' => 'notes',
    'zone' => 'section_operator'
  ],
  [
    'arguments' => [2, 0], # '#'
    'element' => 'notes',
    'zone' => 'section_operator'
  ],
  [
    'arguments' => [27], # 's'
    'element' => 'notes',
    'zone' => 'key'
  ],
  [
    'arguments' => [2, 6], # 's'
    'element' => 'notes',
    'zone' => 'key'
  ],
  [
    'arguments' => [37],
    'element' => 'long', # 'i'
    'zone' => 'content'
  ],
  [
    'arguments' => [4, 0],
    'element' => 'long', # 'i'
    'zone' => 'content'
  ],
  [
    'arguments' => [45],
    'element' => 'long', # 'n'
    'zone' => 'key'
  ],
  [
    'arguments' => [5, 5],
    'element' => 'long', # 'n'
    'zone' => 'key'
  ]
];

describe('Section', function() {
  describe('lookup()', function() {
    beforeAll(function() {
      $input = <<<DOC
color: cyan
close:up
# notes
-- long
is
-- long
DOC;

      $this->document = Parser::parse($input);
    });

    foreach(SCENARIOS as $scenario) {
      $position = join(', ', $scenario['arguments']);

      describe("at {$position}", function() use($scenario) {
        beforeAll(function() use($scenario) {
          $this->lookup = $this->document->lookup(...$scenario['arguments']);
        });

        it("looks up element '{$scenario['element']}'", function() use($scenario) {
          expect($this->lookup['element']->stringKey())->toEqual($scenario['element']);
        });

        it("looks up token '{$scenario['zone']}'", function() use($scenario) {
          expect($this->lookup['zone'])->toEqual($scenario['zone']);
        });
      });
    }
  });
});
