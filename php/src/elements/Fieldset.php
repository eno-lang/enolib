<?php declare(strict_types=1);

namespace Eno;
use Eno\Errors\Validation;
use \BadMethodCallException;
use \Closure;
use \stdClass;

class Fieldset {
  public $touched;

  function __construct(stdClass $context, stdClass $instruction, Section $parent, bool $from_empty = false) {
    $this->all_entries_required = false;
    $this->context = $context;
    $this->entries = [];
    $this->entries_associative = [];
    $this->instruction = $instruction;

    $this->parent = $parent;
    $this->touched = false;

    if(!$from_empty) {
      $instruction->element = $this;

      foreach($instruction->subinstructions as $subinstruction) {
        if($subinstruction->type === 'FIELDSET_ENTRY') {
          $entry = new Field($context, $subinstruction, $this);

          $this->entries[] = $entry;

          if(array_key_exists($subinstruction->key, $this->entries_associative)) {
            $this->entries_associative[$subinstruction->key][] = $entry;
          } else {
            $this->entries_associative[$subinstruction->key] = [$entry];
          }

          $subinstruction->element = $entry;
        } else {
          $subinstruction->element = $this;
        }
      }
    }
  }

  public function __call($function_name, $arguments) {
    if(method_exists('Eno\Loaders', $function_name)) {
      $name = $arguments[0];
      $optional = count($arguments) > 1 ? array_slice($arguments, 1) : [];

      return $this->entry($name, Closure::fromCallable(['Eno\\Loaders', $function_name]), ...$optional);
    } else {
      throw new BadMethodCallException("Call to undefined method Eno\\Fieldset::{$function_name}()");
    }
  }

  public function __toString() : string {
    $entries_count = count($this->entries);
    return "[Fieldset key=\"{$this->instruction->key}\" entries={$entries_count}]";
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

  private function _entry(string $key, bool $required = null) {
    $this->touched = true;

    if(!array_key_exists($key, $this->entries_associative)) {
      if($required || $this->all_entries_required) {
        throw Validation::missingFieldsetEntry($this->context, $key, $this->instruction);
      } else if($required === null) {
        return new MissingField($this->context, $key, $this);
      } else {
        return null;
      }
    }

    $entries = $this->entries_associative[$key];

    if(count($entries) > 1) {
      throw Validation::expectedFieldsetEntryGotFieldsetEntries(
        $this->context,
        $key,
        array_map(function($element) { return $element->instruction; }, $elements)
      );
    }

    return $entries[0];
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

  public function allEntriesRequired(bool $required = true) : void {
    $this->all_entries_required = $required;
  }

  public function assertAllTouched(...$optional) : void {
    $options = [
      'except' => null,
      'only' => null
    ];

    $message = null;

    foreach($optional as $argument) {
      if(is_string($argument) || is_callable($argument)) {
        $message = $argument;
      } else {
        $options = array_merge($options, $argument);
      }
    }

    foreach($this->entries as $entry) {
      if($options['except'] && in_array($entry->instruction->key, $options['except'])) continue;
      if($options['only'] && !in_array($entry->instruction->key, $options['only'])) continue;

      if(!$entry->touched) {
        if(!is_string($message) && is_callable($message)) {
          $message = $message($entry->instruction->key, $entry->value());
        }

        throw Validation::excessKey($this->context, $message, $entry->instruction);
      }
    }
  }

  public function entries() : array {
    $this->touched = true;

    return $this->entries;
  }

  public function entry(string $key) : object {
    return $this->_entry($key);
  }

  public function optionalComment(callable $loader) {
    $this->_comment($loader, false);
  }

  public function optionalEntry(string $key) : ?Field {
    return $this->_entry($key, false);
  }

  public function optionalStringComment() : ?string {
    return $this->_comment(null, false);
  }

  public function raw() : array {
    return [
      $this->instruction->key => array_map(
        function($entry) { return [ $entry->instruction->key => $entry->optionalStringValue() ]; },
        $this->entries
      )
    ];
  }

  public function requiredComment(callable $loader) {
    $this->_comment($loader, true);
  }

  public function requiredEntry(string $key) : object {
    return $this->_entry($key, true);
  }

  public function requiredStringComment() : string {
    return $this->_comment(null, true);
  }

  public function touch(array $options = []) : void {
    $default_options = [ 'entries' => false ];

    $options = array_merge($default_options, $options);

    $this->touched = true;

    if($options['entries']) {
      foreach($this->entries as $entry) {
        $entry->touch();
      }
    }
  }
}
