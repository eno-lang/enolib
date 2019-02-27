<?php declare(strict_types=1);

use Eno\Reporters\Terminal;

describe('Terminal reporter', function() {
  given('_context', function() {
    require(__DIR__ . '/context_fixture.php');
    return $context;
  });

  it('produces text output', function() {
    $this->_context->reporter = new Terminal;

    $snippet = Terminal::report(
      $this->_context,
      $this->_context->instructions[1],
      $this->_context->instructions[0]
    );

    expect($snippet)->toMatchSnapshot('spec/reporters/snapshots/terminal.snap.sh');
  });
});
