<?php declare(strict_types=1);

namespace Eno;
use Eno\Errors\Validation;
use Eno\MissingSection;
use \stdClass;

class MissingElement {
  function __construct(stdClass $context, string $key, object $parent) {
    $this->context = $context;
    $this->key = $key;
    $this->parent = $parent;
  }

  public function __toString() : string {
    return "[MissingElement key=\"{$this->key}\"]";
  }

  public function error(_element) : void {
    if($this->parent instanceof MissingSection)
      $this->parent->error($this);
    } else {
      throw Validation::missingElement($this->context, $key, $this->parent->instruction);
    }
  }

  public function key(callable $_loader) : void {
    $this->error();
  }

  public function optionalComment(callable $_loader) {
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

  public function requiredStringComment() : void {
    $this->error();
  }

  public function stringKey() : void {
    $this->error();
  }
}
