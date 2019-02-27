<?php declare(strict_types=1);

namespace Eno;
use Eno\Errors\Validation;
use Eno\{MissingField,MissingFieldset,MissingList,MissingSection};
use \stdClass;

class MissingSection {
  function __construct(stdClass $context, string $key, object $parent) {
    $this->context = $context;
    $this->key = $key;
    $this->parent = $parent;
  }

  public function __toString() : string {
    return "[MissingSection key=\"{$this->key}\"]";
  }

  public function element(string $key) : MissingElement {
    return new MissingElement($this->context, $key, $this);
  }

  public function elements() : array {
    return [];
  }

  public function error() : void {
    if($this->parent instanceof MissingSection) {
      $this->parent->error($this);
    } else {
      throw Validation::missingSection($this->context, $key, $this->parent->instruction);
    }
  }

  public function field(string $key) : MissingField {
    return new MissingField($this->context, $key, $this);
  }

  public function fields(string $_key) : array {
    return [];
  }

  public function fieldset(string $key) : MissingFieldset {
    return new MissingFieldset($this->context, $key, $this);
  }

  public function fieldsets(string $_key) : array {
    return [];
  }

  public function key($_loader) : void {
    $this->error();
  }

  public function list(string $key) : MissingList {
    return new MissingList($this->context, $key, $this);
  }

  public function lists(string $_key) : array {
    return [];
  }

  public function optionalComment(callable $_loader) {
    return null;
  }

  public function optionalElement(string $_key) {
    return null;
  }

  public function optionalField(string $_key) {
    return null;
  }

  public function optionalFieldset(string $_key) {
    return null;
  }

  public function optionalList(string $_key) {
    return null;
  }

  public function optionalSection(string $_key) {
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

  public function requiredElement(string $_key) : void {
    $this->error();
  }

  public function requiredField(string $_key) : void {
    $this->error();
  }

  public function requiredFieldset(string $_key) : void {
    $this->error();
  }

  public function requiredList(string $_key) : void {
    $this->error();
  }

  public function requiredSection(string $_key) : void {
    $this->error();
  }

  public function requiredStringComment() : void {
    $this->error();
  }

  public function section(string $key) : MissingSection {
    return new MissingSection($this->context, $key, $this);
  }

  public function sections(string $_key) : array {
    return [];
  }

  public function stringKey() : void {
    $this->error();
  }
}
