<?php declare(strict_types=1);

use Eno\{Error, ValidationError};

describe('ValidationError', function() {
  given('text', function() { return 'My error'; });
  given('snippet', function() { return 'My snippet'; });
  given('message', function() { return $this->text . "\n\n" . $this->snippet; });
  given('selection', function() { return [[1, 2], [3, 4]]; });
  given('cursor', function() { return $this->selection[0]; });
  given('error', function() {
    return new ValidationError($this->text, $this->snippet, $this->selection);
  });

  it('returns the expected message', function() {
    expect($this->error->message)->toEqual($this->message);
  });

  it('returns the expected text', function() {
    expect($this->error->text)->toEqual($this->text);
  });

  it('returns the expected snippet', function() {
    expect($this->error->snippet)->toEqual($this->snippet);
  });

  it('returns the expected selection range', function() {
    expect($this->error->selection)->toEqual($this->selection);
  });

  it('returns the expected cursor location', function() {
    expect($this->error->cursor)->toEqual($this->cursor);
  });

  it('is generically catchable as an Eno\\Error when thrown', function() {
    $caught = false;

    try {
      throw $this->error;
    } catch(Error $e) {
      $caught = true;
    }

    expect($caught)->toBe(true);
  });
});
