<?php declare(strict_types=1);

namespace Eno;
use Eno\Errors\Validation;
use Eno\{Fieldset,Section};
use \stdClass;

class MissingField {
  function __construct(stdClass $context, string $key, object $parent) {
    $this->context = $context;
    $this->key = $key;
    $this->parent = $parent;
  }

  public function __toString() : string {
    return "[MissingField key=\"{$this->key}\"]";
  }

  public function error() : void {
    if($this->parent instanceof Section) {
      throw Validation::missingField($this->context, $key, $this->parent->instruction);
    } else if($this->parent instanceof Section) {
      throw Validation::missingFieldsetEntry($this->context, $key, $this->parent->instruction);
    } else {
      $this->parent->error($this);
    }
  }

  public function key($_loader) : void {
    $this->error();
  }

  public function optionalComment(callable $_loader) {
    return null;
  }

  public function optionalStringComment() {
    return null;
  }

  public function optionalStringValue() {
    return null;
  }

  public function optionalValue(callable $_loader) {
    return null;
  }

  public function raw() {
    return null;
  }

  public function requiredComment(callable $_loader) : void {
    $this->error();
  }

  public function requiredStringComment() : void {
    $this->error();
  }

  public function requiredStringValue() : void {
    $this->error();
  }

  public function requiredValue(callable $_loader) : void {
    $this->error();
  }

  public function stringKey() : void {
    $this->error();
  }
}
