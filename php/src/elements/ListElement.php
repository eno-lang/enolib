<?php declare(strict_types=1);

namespace Eno;
use Eno\ValidationError;
use \BadMethodCallException;
use \Closure;
use \stdClass;

class ListElement {
  public $touched;

  function __construct(stdClass $context, stdClass $instruction, Section $parent, bool $from_empty = false) {
    $this->context = $context;
    $this->instruction = $instruction;
    $this->parent = $parent;
    $this->touched = false;
    $this->items = [];

    if(!$from_empty) {
      $instruction->element = $this;

      foreach($instruction->subinstructions as $subinstruction) {
        if($subinstruction->type === 'LIST_ITEM') {
          $subinstruction->element = new Field($context, $subinstruction, $this);
          $this->items[] = $subinstruction->element;
        } else {
          $subinstruction->element = $this;
        }
      }
    }
  }

  public function __call($function_name, $arguments) {
    $function_name = substr($function_name, 0, -5);

    if(method_exists('Eno\Loaders', $function_name)) {
      return $this->items(Closure::fromCallable(['Eno\\Loaders', $function_name]), ...$arguments);
    } else {
      throw new BadMethodCallException("Call to undefined method Eno\\Section::{$function_name}()");
    }
  }

  public function __toString() : string {
    $items_count = count($this->items);
    return "[List key=\"{$this->instruction->key}\" items={$items_count}]";
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

  public function items() : array {
    $this->touched = true;

    return $this->items;
  }

  public function optionalComment(callable $loader) {
    $this->_comment($loader, false);
  }

  public function optionalStringComment() : ?string {
    return $this->_comment(null, false);
  }

  public function optionalStringValues() : array {
    $this->touched = true;

    return array_map(function($item) { return $item->optionalStringValue(); }, $this->items);
  }

  public function optionalValues(callable $loader) {
    $this->touched = true;

    return array_map(function($item) { return $item->optionalValue($loader); }, $this->items);
  }

  public function length() : int {
    $this->touched = true;

    return count($this->items);
  }

  public function raw() : array {
    return [
      $this->instruction->key => array_map(
        function($item) { return $item->optionalStringValue(); },
        $this->items
      )
    ];
  }

  public function requiredComment(callable $loader) {
    $this->_comment($loader, true);
  }

  public function requiredStringComment() : string {
    return $this->_comment(null, true);
  }

  public function requiredStringValues() : array {
    $this->touched = true;

    return array_map(function($item) { return $item->requiredStringValue(); }, $this->items);
  }

  public function requiredValues(callable $loader) : array  {
    $this->touched = true;

    return array_map(function($item) { return $item->requiredValue($loader); }, $this->items);
  }

  public function touch(array $options = []) : void {
    $default_options = [ 'items' => false ];

    $options = array_merge($default_options, $options);

    $this->touched = true;

    if($options['items']) {
      foreach($this->items as $item) {
        $item->touch();
      }
    }
  }
}
