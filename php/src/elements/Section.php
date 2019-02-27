<?php declare(strict_types=1);

namespace Eno;
use Eno\Errors\Validation;
use \BadMethodCallException;
use \Closure;
use \stdClass;

// TODO: Here and elsewhere - go over all type annotations again and correct/extend

// TODO: Here and elsewhere - declare private properties private
//       (And use reflection API in specs to still test private properties where needed)

class Section {
  public $touched;

  function __construct(stdClass $context, stdClass $instruction, Section $parent = null) {
    $this->all_elements_required = false;
    $this->context = $context;
    $this->elements = [];
    $this->elements_associative = [];
    $this->instruction = $instruction;

    $this->parent = $parent;
    $this->touched = false;

    $this->instruction->element = $this;

    foreach($this->instruction->subinstructions as $subinstruction) {
      switch($subinstruction->type) {
        case 'ELEMENT':
          $this->append($subinstruction->key, new EmptyElement($context, $subinstruction, $this));
          break;
        case 'FIELD':
          $this->append($subinstruction->key, new Field($context, $subinstruction, $this));
          break;
        case 'LIST':
          $this->append($subinstruction->key, new ListElement($context, $subinstruction, $this));
          break;
        case 'MULTILINE_FIELD_BEGIN':
          $this->append($subinstruction->key, new Field($context, $subinstruction, $this));
          break;
        case 'FIELDSET':
          $this->append($subinstruction->key, new Fieldset($context, $subinstruction, $this));
          break;
        case 'SECTION':
            $this->append($subinstruction->key, new Section($context, $subinstruction, $this));
        default:
          $subinstruction->element = $this;
      }
    }
  }

  public function __call($function_name, $arguments) {
    $loader_name = $function_name;

    if(strpos($function_name, 'List', strlen($function_name) - 4) !== false) {
      $loader_name = substr($function_name, 0, -4);
    }

    if(method_exists('Eno\Loaders', $loader_name)) {
      $loader = Closure::fromCallable(['Eno\\Loaders', $loader_name]);
      $key = $arguments[0];
      $optional = count($arguments) > 1 ? array_slice($arguments, 1) : [];

      if($loader_name === $function_name) {
        return $this->field($key, $loader, ...$optional);
      } else {
        return $this->list($key, $loader, ...$optional);
      }
    } else {
      throw new BadMethodCallException("Call to undefined method Eno\\Section::{$function_name}()");
    }
  }

  public function __toString() : string {
    $elements_count = count($this->elements);

    if(property_exists($this->instruction, 'key')) {
      return "[Section key=\"{$this->instruction->key}\" elements={$elements_count}]";
    } else {
      return "[Section document elements={$elements_count}]";
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

  private function _element(string $key, bool $required = null) : ?object {
    $this->touched = true;

    if(!array_key_exists($key, $this->elements_associative)) {
      if($required || $this->all_elements_required) {
        throw Validation::missingElement($this->context, $key, $this->instruction);
      } else if($required === null) {
        return new MissingElement($this->context, $key, $this);
      } else {
        return null;
      }
    }

    $elements = $this->elements_associative[$key];

    if(count($elements) > 1) {
      throw Validation::expectedElementGotElements(
        $this->context,
        $key,
        array_map(function($element) { return $element->instruction; }, $elements)
      );
    }

    return $elements[0];
  }

  private function _field(string $key, bool $required = null) : ?object {
    $this->touched = true;

    if(!array_key_exists($key, $this->elements_associative)) {
      if($required || $this->all_elements_required) {
        throw Validation::missingField($this->context, $key, $this->instruction);
      } else if($required === null) {
        return new MissingField($this->context, $key, $this);
      } else {
        return null;
      }
    }

    $elements = $this->elements_associative[$key];

    foreach($elements as $element) {
      if($element instanceof Field || $element instanceof EmptyElement)
        continue;

      if($element instanceof Fieldset)
        throw Validation::expectedFieldGotFieldset($this->context, $element->instruction);

      if($element instanceof ListElement)
        throw Validation::expectedFieldGotList($this->context, $element->instruction);

      if($element instanceof Section)
        throw Validation::expectedFieldGotSection($this->context, $element->instruction);
    }

    if(count($elements) > 1) {
      throw Validation::expectedFieldGotFields(
        $this->context,
        $key,
        array_map(function($element) { return $element->instruction; }, $elements)
      );
    }

    $element = $elements[0];

    if($element instanceof EmptyElement) {
      return new Field($this->context, $element->instruction, $this, true);
    } else {
      return $element;
    }
  }

  private function _fieldset(string $key, bool $required = null) : ?object {
    $this->touched = true;

    if(!array_key_exists($key, $this->elements_associative)) {
      if($required || $this->all_elements_required) {
        throw Validation::missingFieldset($this->context, $key, $this->instruction);
      } else if($required === null) {
        return new MissingFieldset($this->context, $key, $this);
      } else {
        return null;
      }
    }

    $elements = $this->elements_associative[$key];

    foreach($elements as $element) {
      if($element instanceof Fieldset || $element instanceof EmptyElement)
        continue;

      if($element instanceof ListElement)
        throw Validation::expectedFieldsetGotList($this->context, $element->instruction);

      if($element instanceof Section)
        throw Validation::expectedFieldsetGotSection($this->context, $element->instruction);

      if($element instanceof Field)
        throw Validation::expectedFieldsetGotField($this->context, $element->instruction);
    }

    if(count($elements) > 1) {
      throw Validation::expectedFieldsetGotFieldsets(
        $this->context,
        $key,
        array_map(function($element) { return $element->instruction; }, $elements)
      );
    }

    $element = $elements[0];

    if($element instanceof EmptyElement) {
      return new Fieldset($this->context, $element->instruction, $this, true);
    } else {
      return $element;
    }
  }

  private function _list(string $key, bool $required = null) : ?object {
    $this->touched = true;

    if(!array_key_exists($key, $this->elements_associative)) {
      if($required || $this->all_elements_required) {
        throw Validation::missingList($this->context, $key, $this->instruction);
      } else if($required === null) {
        return new MissingList($this->context, $key, $this);
      } else {
        return null;
      }
    }

    $elements = $this->elements_associative[$key];

    foreach($elements as $element) {
      if($element instanceof ListElement || $element instanceof EmptyElement)
        continue;

      if($element instanceof Field)
        throw Validation::expectedListGotField($this->context, $element->instruction);

      if($element instanceof Fieldset)
        throw Validation::expectedListGotFieldset($this->context, $element->instruction);

      if($element instanceof Section)
        throw Validation::expectedListGotSection($this->context, $element->instruction);
    }

    if(count($elements) > 1) {
      throw Validation::expectedListGotLists(
        $this->context,
        $key,
        array_map(function($element) { return $element->instruction; }, $elements)
      );
    }

    return $elements[0];
  }

  private function _section(string $key, bool $required = null) : ?object {
    $this->touched = true;

    if(!array_key_exists($key, $this->elements_associative)) {
      if($required || $this->all_elements_required) {
        throw Validation::missingSection($this->context, $key, $this->instruction);
      } else if($required === null) {
        return new MissingSection($this->context, $key, $this);
      } else {
        return null;
      }
    }

    $elements = $this->elements_associative[$key];

    foreach($elements as $element) {
      if($element instanceof Section)
        continue;

      if($element instanceof Fieldset)
        throw Validation::expectedSectionGotFieldset($this->context, $element->instruction);

      if($element instanceof EmptyElement)
        throw Validation::expectedSectionGotEmpty($this->context, $element->instruction);

      if($element instanceof ListElement)
        throw Validation::expectedSectionGotList($this->context, $element->instruction);

      if($element instanceof Field)
        throw Validation::expectedSectionGotField($this->context, $element->instruction);
    }

    if(count($elements) > 1) {
      throw Validation::expectedSectionGotSections(
        $this->context,
        $key,
        array_map(function($element) { return $element->instruction; }, $elements)
      );
    }

    return $elements[0];
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

  public function allElementsRequired(bool $required = true) : void {
    $this->all_elements_required = $required;

    foreach($this->elements as $element) {
      if($element instanceof Section) {
        $element->allElementsRequired($required);
      } else if($element instanceof Fieldset) {
        $element->allEntriesRequired($required);
      }
    }
  }

  private function append(string $key, object $element) : void {
    $this->elements[] = $element;

    if(array_key_exists($key, $this->elements_associative)) {
      $this->elements_associative[$key][] = $element;
    } else {
      $this->elements_associative[$key] = [$element];
    }
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

    foreach($this->elements_associative as $key => $elements) {
      if($options['except'] && in_array($key, $options['except'])) continue;
      if($options['only'] && !in_array($key, $options['only'])) continue;

      foreach($elements as $element) {
        if(!$element->touched) {
          if(!is_string($message) && is_callable($message)) {
            $value = $element instanceof Fieldset ||
                     $element instanceof Section ?
                          null : $element->value();

            $message = $message($element->name, $value);
          }

          throw Validation::excessKey($this->context, $message, $element->instruction);
        }

        if($element instanceof Fieldset || $element instanceof Section) {
          $element->assertAllTouched($message);
        }
      }
    }
  }

  public function element(string $key) : ?object {
    return $this->_element($key);
  }

  public function elements() : array {
    $this->touched = true;

    return $this->elements;
  }

  public function field(string $key) {
    return $this->_field($key);
  }

  public function fields(string $key) : array {
    $this->touched = true;

    if(!array_key_exists($key, $this->elements_associative))
      return [];

    $elements = $this->elements_associative[$key];

    return array_map(
      function($element) {
        if($element instanceof Field)
          return $element;

        if($element instanceof EmptyElement)
          return new Field($this->context, $element->instruction, $this, true);

        if($element instanceof Fieldset)
          throw Validation::expectedFieldsGotFieldset($this->context, $element->instruction);

        if($element instanceof ListElement)
          throw Validation::expectedFieldsGotList($this->context, $element->instruction);

        if($element instanceof Section)
          throw Validation::expectedFieldsGotSection($this->context, $element->instruction);
      },
      $elements
    );
  }

  public function fieldset(string $key) : object {
    return $this->_fieldset($key);
  }

  public function fieldsets(string $key) : array {
    $this->touched = true;

    if(!array_key_exists($key, $this->elements_associative))
      return [];

    $elements = $this->elements_associative[$key];

    return array_map(
      function($element) {
        if($element instanceof Fieldset)
          return $element;

        if($element instanceof EmptyElement)
          return new Fieldset($this->context, $element->instruction, $this, true);

        if($element instanceof ListElement)
          throw Validation::expectedFieldsetsGotList($this->context, $element->instruction);

        if($element instanceof Section)
          throw Validation::expectedFieldsetsGotSection($this->context, $element->instruction);

        if($element instanceof Field)
          throw Validation::expectedFieldsetsGotField($this->context, $element->instruction);
      },
      $elements
    );
  }

  public function list(string $key) : object {
    return $this->_list($key);
  }

  public function lists(string $key) : array {
    if(!array_key_exists($key, $this->elements_associative))
      return [];

    $elements = $this->elements_associative[$key];

    return array_map(
      function($element) {
        if($element instanceof ListElement)
          return $element;

        if($element instanceof EmptyElement)
          return new ListElement($this->context, $element->instruction, $this, true);

        if($element instanceof Fieldset)
          throw Validation::expectedListsGotFieldset($this->context, $element->instruction);

        if($element instanceof Section)
          throw Validation::expectedListsGotSection($this->context, $element->instruction);

        if($element instanceof Field)
          throw Validation::expectedListsGotField($this->context, $element->instruction);
      },
      $elements
    );
  }

  public function lookup(...$position) : ?array {
    $line = null;
    $column = null;

    if(count($position) === 2) {
      $line = $position[0];
      $column = $position[1];
    } else {
      $index_argument = $position[0];
      $index = 0;
      $line = 0;
      $column = 0;
      while($index != $index_argument) {
        if($index >= strlen($this->context->input))
          return null;

        if($this->context->input[$index] === "\n") {
          $line++;
          $column = 0;
        } else {
          $column++;
        }

        $index++;
      }
    }

    $instruction = null;
    foreach($this->context->instructions as $find_instruction) {
      if($find_instruction->line === $line) {
        $instruction = $find_instruction;
        break;
      }
    }

    if(!$instruction)
      return null;

    $result = [
      'element' => $instruction->element,
      'zone' => 'element'
    ];

    if($instruction->ranges) {
      $rightmost_match = 0;

      foreach($instruction->ranges as $type => $range) {
        if($column >= $range[0] && $column <= $range[1] && $range[0] >= $rightmost_match) {
          $result['zone'] = $type;
          $rightmost_match = $column;
        }
      }
    }

    return $result;
  }

  public function optionalComment(callable $loader) {
    $this->_comment($loader, false);
  }

  public function optionalElement(string $key) : ?object {
    return $this->_element($key, false);
  }

  public function optionalField(string $key) : ?object {
    return $this->_field($key, false);
  }

  public function optionalFieldset(string $key) : ?object {
    return $this->_fieldset($key, false);
  }

  public function optionalList(string $key) : ?object {
    return $this->_list($key, false);
  }

  public function optionalSection(string $key) : object {
    return $this->_section($key, false);
  }

  public function optionalStringComment() : ?string {
    return $this->_comment(null, false);
  }


  public function raw() : array {
    $elements = array_map(
      function($element) { return $element->raw(); },
      $this->elements
    );

    if(property_exists($this->instruction, 'key'))
      return [ $this->instruction->key => $elements ];

    return $elements;
  }

  public function requiredComment(callable $loader) {
    $this->_comment($loader, true);
  }

  public function requiredElement(string $key) : ?object {
    return $this->_element($key, true);
  }

  public function requiredField(string $key) : object {
    return $this->_field($key, true);
  }

  public function requiredFieldset(string $key) : object {
    return $this->_fieldset($key, true);
  }

  public function requiredList(string $key) : object {
    return $this->_list($key, true);
  }

  public function requiredSection(string $key) : object {
    return $this->_section($key, true);
  }

  public function requiredStringComment() : string {
    return $this->_comment(null, true);
  }

  public function section(string $key) : object {
    return $this->_section($key);
  }

  public function sections(string $key) : array {
    $this->touched = true;

    if(!array_key_exists($key, $this->elements_associative))
      return [];

    $elements = $this->elements_associative[$key];

    foreach($elements as $element) {
      if($element instanceof Section)
        continue;

      if($element instanceof Fieldset)
        throw Validation::expectedSectionsGotFieldset($this->context, $element->instruction);

      if($element instanceof EmptyElement)
        throw Validation::expectedSectionsGotEmpty($this->context, $element->instruction);

      if($element instanceof ListElement)
        throw Validation::expectedSectionsGotList($this->context, $element->instruction);

      if($element instanceof Field)
        throw Validation::expectedSectionsGotField($this->context, $element->instruction);
    }

    return $elements;
  }

  public function stringKey() : string {
    $this->touched = true;

    return $this->instruction->key;
  }

  public function touch() : void {
    $this->touched = true;
  }
}
