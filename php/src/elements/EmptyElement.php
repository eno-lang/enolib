<?php declare(strict_types=1);

namespace Eno;
use Eno\Errors\Validation;
use Eno\ValidationError;
use \stdClass;

class EmptyElement {
  public $touched;

  function __construct(stdClass $context, stdClass $instruction, Section $parent) {
    $this->context = $context;
    $this->instruction = $instruction;

    $this->parent = $parent;
    $this->touched = false;

    $this->instruction->element = $this;
  }

  public function __toString() : string {
    $key = $this->instruction->key;
    return "[EmptyElement key=\"{$key}\"]";
  }

  public function error($message = null) : ValidationError {
    if(!is_string($message) && is_callable($message)) {
      $message = $message($this->key, null);
    }

    return Validation::valueError($this->context, $message, $this->instruction);
  }

  private function _comment(?callable $loader, bool $required) {
    $this->touched = true;

    $comment = $this->lazyComment();

    if($comment === null) {
      if($required)
        throw Validation::missingComment($this->context, $this->instruction);

      return null;
    }

    if($loader === null)
      return $comment;

    try {
      return $loader($comment);
    } catch(Exception $exception) {
      throw Validation::commentError($this->context, $exception->getMessage(), $this->instruction);
    }
  }

  public function key(callable $loader) {
    $this->touched = true;

    try {
      return $loader($this->instruction->key);
    } catch(Exception $exception) {
      throw Validation::keyError($this->context, $exception->getMessage(), $this->instruction);
    }
  }

  private function lazyComment() : ?string {
    if(!property_exists($this, 'cachedComment')) {
      if(array_key_exists('comment_instructions', $this->instruction)) {
        $this->cachedComment = join("\n", array_map(function($comment_instruction) {
          return $comment_instruction->comment;
        }, $this->instruction->comment_instructions));
      } else {
        $this->cachedComment = null;
      }
    }

    return $this->cachedComment;
  }

  public function optionalComment(callable $loader) {
    $this->_comment($loader, false);
  }

  public function optionalStringComment() : ?string {
    return $this->_comment(null, false);
  }

  public function raw() : array {
    return [ $this->key => null ];
  }

  public function requiredComment(callable $loader) {
    $this->_comment($loader, true);
  }

  public function requiredStringComment() : string {
    return $this->_comment(null, true);
  }

  public function stringKey() : string {
    $this->touched = true;

    return $this->instruction->key;
  }

  public function touch() : void {
    $this->touched = true;
  }
}
