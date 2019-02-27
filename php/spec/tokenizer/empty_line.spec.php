<?php declare(strict_types=1);

require_once(__DIR__ . '/util.php');

describe('Empty line tokenization', function() {
  given('input', function() {
    return "\n" .
           " \n" .
           "  \n" .
           "   \n" .
           "\n" .
           " \n" .
           "  \n" .
           "   \n";
  });

  it('works as specified', function() {
    $instructions = inspectTokenization($this->input);

    expect($instructions)->toMatchSnapshot('spec/tokenizer/snapshots/empty_line.snap.json');
  });

  describe('Zero length input', function() {
    it('works as specified', function() {
      $zero_length_input = "";
      $instructions = inspectTokenization($zero_length_input);

      expect($instructions)->toMatchSnapshot('spec/tokenizer/snapshots/zero_length.snap.json');
    });
  });
});
