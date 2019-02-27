<?php declare(strict_types=1);

namespace Eno;
use Eno\Errors\Validation;
use Eno\MissingSection;
use \stdClass;

class MissingList {
  function __construct(stdClass $context, string $key, object $parent) {
    $this->context = $context;
    $this->key = $key;
    $this->parent = $parent;
  }

  public function __toString() : string {
    return "[MissingList key=\"{$this->key}\"]";
  }

  public function error() : void {
    if($this->parent instanceof MissingSection) {
      $this->parent->error($this);
    } else {
      throw Validation::missingList($this->context, $key, $this->parent->instruction);
    }
  }

  public function items() : array {
    return [];
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

  public function optionalStringValues() : array {
    return [];
  }

  public function optionalValues(callable $_loader) : array {
    return [];
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

  public function requiredStringValues() : array {
    return [];
  }

  public function requiredValues(callable $_loader) : array {
    return [];
  }

  public function stringKey() : void {
    $this->error();
  }
}
