<?php declare(strict_types=1);

use Eno\Grammar;

$grammarReflection = new ReflectionClass('Eno\\Grammar');
$match_indices =
  array_filter(
    $grammarReflection->getConstants(),
    function($v, $k) {
      return substr($k, -6) === '_INDEX';
    },
    ARRAY_FILTER_USE_BOTH
  );

describe('Unified pattern matcher', function() use($match_indices) {
  require_once(__DIR__ . '/scenarios.php');

  foreach($SCENARIOS as $scenario) {
    foreach($scenario['variants'] as $variant) {
      describe("scenario '{$scenario['syntax']}' with variant '{$variant}'", function() use($match_indices, $scenario, $variant) {
        $matched = preg_match(Grammar::REGEX, $variant, $match, PREG_OFFSET_CAPTURE | PREG_UNMATCHED_AS_NULL);

        if(isset($scenario['captures'])) {
          it('matches', function() use($matched) {
            expect($matched)->toBe(1);
          });

          foreach($match_indices as $constant => $index) {
            if(isset($scenario['captures'][$index])) {
              $capture = $scenario['captures'][$index];

              it("captures '{$capture}' in group {$constant}", function() use($capture, $index, $match) {
                expect($match[$index][0])->toBe($capture);
              });
            } else {
              it("captures nothing in group {$constant}", function() use($index, $match) {
                expect(isset($match[$index][0]))->toBe(false);
              });
            }
          }
        } else {
          it('does not match', function() use($match, $matched) {
            expect($matched === 0 || $match[0][1] > 0)->toBe(true);
          });
        }
      });
    }
  }
});
