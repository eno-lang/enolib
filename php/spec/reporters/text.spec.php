<?php declare(strict_types=1);

use Eno\Reporters\Text;

describe('Text reporter', function() {
  given('_context', function() {
    require(__DIR__ . '/context_fixture.php');
    return $context;
  });

  it('produces text output', function() {
    $this->_context->reporter = new Text;

    $snippet = Text::report(
      $this->_context,
      $this->_context->instructions[1],
      $this->_context->instructions[0]
    );

    expect($snippet)->toMatchSnapshot('spec/reporters/snapshots/text.snap.txt');
  });
});
