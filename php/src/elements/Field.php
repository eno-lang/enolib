<?php declare(strict_types=1);

namespace Eno;

use \BadMethodCallException;
use \Closure;
use \Exception;
use \ReflectionFunction;
use \stdClass;
use Eno\Errors\Validation;
use Eno\ValidationError;

class Field {
  public $touched;

  function __construct(stdClass $context, stdClass $instruction, object $parent, bool $from_empty = false) {
    $this->context = $context;
    $this->instruction = $instruction;
    $this->parent = $parent;
    $this->touched = false;

    if(!$from_empty) {
      $this->instruction->element = $this;

      foreach($this->instruction->subinstructions as $subinstruction) {
        $subinstruction->element = $this;
      }
    }
  }

  public function __call($function_name, $arguments) {
    if(method_exists('Eno\Loaders', $function_name)) {
      return $this->value(Closure::fromCallable(['Eno\\Loaders', $function_name]), ...$arguments);
    } else {
      throw new BadMethodCallException("Call to undefined method Eno\\Field::{$function_name}()");
    }
  }

  public function __toString() : string {
    $value = $this->lazyValue();

    if($value === null) {
      $value = 'null';
    } else {
      $value = str_replace("\n", '\n', $value);
      if(strlen($value) > 14) {
        $value = substr($value, 0, 11) . '...';
      }
      $value = "\"{$value}\"";
    }

    if(property_exists($this->instruction, 'key')) {
      return "[Field key=\"{$this->instruction->key}\" value={$value}]";
    } else {
      return "[Field value={$value}]";
    }
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

  private function _value(?callable $loader, bool $required) {
    $this->touched = true;

    $value = $this->lazyValue();

    if($value === null) {
      if($required) {
        throw Validation::missingValue($this->context, $this->instruction);
      } else {
        return null;
      }
    }

    if($loader) {
      try {
        return $loader($value);
      } catch(Exception $exception) {
        throw Validation::valueError($this->context, $exception->getMessage(), $this->instruction);
      }
    } else {
      return $value;
    }
  }


  private function lazyValue() : ?string {
    if(!property_exists($this, 'cached_value')) {
      if(property_exists($this->instruction, 'mirror')) {
        return $this->instruction->mirror->element->lazyValue();
      } else {
        $this->cached_value = null;

      if($this->instruction->type === 'MULTILINE_FIELD_BEGIN') {
        if(property_exists($this->instruction, 'value_range')) {
          $this->cached_value = substr(
            $this->context->input,
            $this->instruction->value_range[0],
            $this->instruction->value_range[1] - $this->instruction->value_range[0] + 1
          );
        }
      } else {
        if(property_exists($this->instruction, 'value')) {
          $this->cached_value = $this->instruction->value;
        }

        if(property_exists($this->instruction, 'subinstructions')) {
          $unappliedSpacing = false;

          foreach($this->instruction->subinstructions as $subinstruction) {
            if($subinstruction->type !== 'CONTINUATION')
              continue;

              if($this->cached_value === null) {
                $this->cached_value = $subinstruction->value;
                $unappliedSpacing = false;
              } else if($subinstruction->value === null) {
                $unappliedSpacing = $unappliedSpacing || $subinstruction->spaced;
              } else if($subinstruction->spaced || $unappliedSpacing) {
                $this->cached_value .= ' ' . $subinstruction->value;
                $unappliedSpacing = false;
              } else {
                $this->cached_value .= $subinstruction->value;
              }
            }
          }
        }
      }
    }

    return $this->cached_value;
  }

  public function error($message = null) : ValidationError {
    if(!is_string($message) && is_callable($message)) {
      $message = $message($this->instruction->key, $this->_value);
    }

    return Validation::valueError($this->context, $message, $this->instruction);
  }

  public function key(callable $loader) {
    $this->touched = true;

    try {
      return $loader($this->instruction->key);
    } catch(Exception $exception) {
      throw Validation::keyError($this->context, $exception->getMessage(), $this->instruction);
    }
  }

  public function optionalComment(callable $loader) {
    $this->_comment($loader, false);
  }

  public function optionalStringComment() : ?string {
    return $this->_comment(null, false);
  }

  public function optionalStringValue() : ?string {
    return $this->_value(null, false);
  }

  public function raw() {
    if(property_exists($this->instruction, 'key')) {
      return [ $this->instruction->key => $this->lazyValue() ];
    } else {
      return $this->lazyValue();
    }
  }

  public function requiredComment(callable $loader) {
    $this->_comment($loader, true);
  }

  public function requiredStringComment() : string {
    return $this->_comment(null, true);
  }

  public function requiredStringValue() : string {
    return $this->_value(null, true);
  }

  public function stringKey() : string {
    $this->touched = true;

    return $this->instruction->key;
  }

  public function touch() : void {
    $this->touched = true;
  }
}
