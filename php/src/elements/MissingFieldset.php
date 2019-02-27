<?php declare(strict_types=1);

namespace Eno;
use Eno\Errors\Validation;
use Eno\{MissingField,MissingSection};
use \stdClass;

class MissingFieldset {
  function __construct(stdClass $context, string $key, object $parent) {
    $this->context = $context;
    $this->key = $key;
    $this->parent = $parent;
  }

  public function __toString() : string {
    return "[MissingFieldset key=\"{$this->key}\"]";
  }

  public function entry(string $key) : MissingField {
    return new MissingField($this->context, $key, $this);
  }

  public function entries() : array {
    return [];
  }

  public function error() : void {
    if($this->parent instanceof MissingSection) {
      $this->parent->error($this);
    } else {
      throw Validation::missingFieldset($this->context, $key, $this->parent->instruction);
    }
  }

  public function key($_loader) : void {
    $this->error();
  }

  public function optionalComment(callable $_loader) {
    return null;
  }

  public function optionalEntry(string $_key) {
    return null;
  }

  public function optionalStringComment() {
    return null;
  }

  public function raw() {
    return null;
  }

  public function requiredComment(callable $_loader) : void {
    $this->error();
  }

  public function requiredEntry(string $_key) : void {
    $this->error();
  }

  public function requiredStringComment() : void {
    $this->error();
  }

  public function stringKey() : void {
    $this->error();
  }
}
