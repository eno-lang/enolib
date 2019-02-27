<?php declare(strict_types=1);

namespace Eno\Errors;
use Eno\ValidationError;
use \stdClass;

function deepExpandInstruction(stdClass $instruction) : array {
  $result = [$instruction];

  if(array_key_exists('subinstructions', $instruction)) {
    foreach($instruction->subinstructions as $subinstruction) {
      $result = array_merge($result, deepExpandInstruction($subinstruction));
    }
  }

  return $result;
}

function expandInstructions(array $instructions) : array {
  $result = [];

  foreach($instructions as $instruction) {
    $result[] = $instruction;

    if(array_key_exists('subinstructions', $instruction)) {
      $result = array_merge($result, $instruction->subinstructions);
    }
  }

  return $result;
}

class Validation {
  public static function commentError(stdClass $context, string $message, stdClass $instruction) : ValidationError {
    $message = $context->messages->commentError($instruction->key, $message);
    $snippet = $context->reporter::report($context, $instruction->comment_instructions, $instruction);

    $first_instruction = $instruction->comment_instructions[0];
    $last_instruction = $instruction->comment_instructions[count($instruction->comment_instructions) - 1];

    $selection = [
      [$first_instruction->line, $first_instruction->ranges['comment'][0]],
      [$last_instruction->line, $last_instruction->ranges['comment'][1]]
    ];

    return new ValidationError($message, $snippet, $selection);
  }

  public static function excessKey(stdClass $context, ?string $message, stdClass $instruction) : ValidationError {
    if($message === null) {
      $message = $context->messages->excessKey($instruction->key);
    }

    $snippet = null;
    $selection = [[$instruction->line, 0]];
    if(array_key_exists('subinstructions', $instruction) && count($instruction->subinstructions) > 0) {
      $snippet = $context->reporter::report($context, array_merge([$instruction], $instruction->subinstructions));
      $last_instruction = $instruction->subinstructions[count($instruction->subinstructions) - 1];
      $selection[] = [$last_instruction->line, $last_instruction->length];
    } else {
      $snippet = $context->reporter::report($context, $instruction);
      $selection[] = [$instruction->line, $instruction->length];
    }

    return new ValidationError($message, $snippet, $selection);
  }

  public static function expectedFieldsetsGotField(stdClass $context, stdClass $instruction) : ValidationError {
    $message = $context->messages->expectedFieldsetsGotField($instruction->key);

    $snippet = $context->reporter::report($context, array_merge([$instruction], $instruction->subinstructions));

    $selection = [[$instruction->line, 0]];
    if(count($instruction->subinstructions) > 0) {
      $last_instruction = $instruction->subinstructions[count($instruction->subinstructions) - 1];
      $selection[] = [$last_instruction->line, $last_instruction->length];
    } else {
      $selection[] = [$instruction->line, $instruction->length];
    }

    return new ValidationError($message, $snippet, $selection);
  }

  public static function expectedFieldsetsGotList(stdClass $context, stdClass $instruction) : ValidationError {
    $message = $context->messages->expectedFieldsetsGotList($instruction->key);

    $snippet = $context->reporter::report($context, array_merge([$instruction], $instruction->subinstructions));

    $selection = [[$instruction->line, 0]];
    if(count($instruction->subinstructions) > 0) {
      $last_instruction = $instruction->subinstructions[count($instruction->subinstructions) - 1];
      $selection[] = [$last_instruction->line, $last_instruction->length];
    } else {
      $selection[] = [$instruction->line, $instruction->length];
    }

    return new ValidationError($message, $snippet, $selection);
  }

  public static function expectedFieldsetsGotSection(stdClass $context, stdClass $instruction) : ValidationError {
    $message = $context->messages->expectedFieldsetsGotSection($instruction->key);

    $snippet = $context->reporter::report($context, array_merge([$instruction], $instruction->subinstructions));

    $selection = [[$instruction->line, 0]];
    if(count($instruction->subinstructions) > 0) {
      $last_instruction = $instruction->subinstructions[count($instruction->subinstructions) - 1];
      $selection[] = [$last_instruction->line, $last_instruction->length];
    } else {
      $selection[] = [$instruction->line, $instruction->length];
    }

    return new ValidationError($message, $snippet, $selection);
  }

  public static function expectedFieldsetGotFieldsets(stdClass $context, string $key, array $instructions) : ValidationError {
    $expanded_instructions = expandInstructions($instructions);
    $last_instruction = $expanded_instructions[count($expanded_instructions) - 1];

    $message = $context->messages->expectedFieldsetGotFieldsets($key);

    $snippet = $context->reporter::report($context, $instructions, $expanded_instructions);

    $selection = [
      [$expanded_instructions[0]->line, 0],
      [$last_instruction->line, $last_instruction->length]
    ];

    return new ValidationError($message, $snippet, $selection);
  }

  public static function expectedFieldsetGotField(stdClass $context, stdClass $instruction) : ValidationError {
    $message = $context->messages->expectedFieldsetGotField($instruction->key);

    $snippet = $context->reporter::report($context, array_merge([$instruction], $instruction->subinstructions));

    $selection = [[$instruction->line, 0]];
    if(count($instruction->subinstructions) > 0) {
      $last_instruction = $instruction->subinstructions[count($instruction->subinstructions) - 1];
      $selection[] = [$last_instruction->line, $last_instruction->length];
    } else {
      $selection[] = [$instruction->line, $instruction->length];
    }

    return new ValidationError($message, $snippet, $selection);
  }

  public static function expectedFieldsetGotList(stdClass $context, stdClass $instruction) : ValidationError {
    $message = $context->messages->expectedFieldsetGotList($instruction->key);

    $snippet = $context->reporter::report($context, array_merge([$instruction], $instruction->subinstructions));

    $selection = [[$instruction->line, 0]];
    if(count($instruction->subinstructions) > 0) {
      $last_instruction = $instruction->subinstructions[count($instruction->subinstructions) - 1];
      $selection[] = [$last_instruction->line, $last_instruction->length];
    } else {
      $selection[] = [$instruction->line, $instruction->length];
    }

    return new ValidationError($message, $snippet, $selection);
  }

  public static function expectedFieldsetGotSection(stdClass $context, stdClass $instruction) : ValidationError {
    $message = $context->messages->expectedFieldsetGotSection($instruction->key);

    $snippet = $context->reporter::report($context, array_merge([$instruction], $instruction->subinstructions));

    $selection = [[$instruction->line, 0]];
    if(count($instruction->subinstructions) > 0) {
      $last_instruction = $instruction->subinstructions[count($instruction->subinstructions) - 1];
      $selection[] = [$last_instruction->line, $last_instruction->length];
    } else {
      $selection[] = [$instruction->line, $instruction->length];
    }

    return new ValidationError($message, $snippet, $selection);
  }

  public static function expectedElementGotElements(stdClass $context, string $key, array $instructions) : ValidationError {
    $expanded_instructions = expandInstructions($instructions);
    $last_instruction = $expanded_instructions[count($expanded_instructions) - 1];

    $message = $context->messages->expectedElementGotElements($key);

    $snippet = $context->reporter::report($context, $instructions, $expanded_instructions);

    $selection = [
      [$expanded_instructions[0]->line, 0],
      [$last_instruction->line, $last_instruction->length]
    ];

    return new ValidationError($message, $snippet, $selection);
  }

  public static function expectedFieldGotFieldset(stdClass $context, stdClass $instruction) : ValidationError {
    $message = $context->messages->expectedFieldGotFieldset($instruction->key);

    $snippet = $context->reporter::report($context, array_merge([$instruction], $instruction->subinstructions));

    $selection = [[$instruction->line, 0]];
    if(count($instruction->subinstructions) > 0) {
      $last_instruction = $instruction->subinstructions[count($instruction->subinstructions) - 1];
      $selection[] = [$last_instruction->line, $last_instruction->length];
    } else {
      $selection[] = [$instruction->line, $instruction->length];
    }

    return new ValidationError($message, $snippet, $selection);
  }

  public static function expectedFieldGotList(stdClass $context, stdClass $instruction) : ValidationError {
    $message = $context->messages->expectedFieldGotList($instruction->key);

    $snippet = $context->reporter::report($context, array_merge([$instruction], $instruction->subinstructions));

    $selection = [[$instruction->line, 0]];
    if(count($instruction->subinstructions) > 0) {
      $last_instruction = $instruction->subinstructions[count($instruction->subinstructions) - 1];
      $selection[] = [$last_instruction->line, $last_instruction->length];
    } else {
      $selection[] = [$instruction->line, $instruction->length];
    }

    return new ValidationError($message, $snippet, $selection);
  }

  public static function expectedFieldGotFields(stdClass $context, string $key, array $instructions) : ValidationError {
    $expanded_instructions = expandInstructions($instructions);
    $last_instruction = $expanded_instructions[count($expanded_instructions) - 1];

    $message = $context->messages->expectedFieldGotFields($key);

    $snippet = $context->reporter::report($context, $instructions, $expanded_instructions);

    $selection = [
      [$expanded_instructions[0]->line, 0],
      [$last_instruction->line, $last_instruction->length]
    ];

    return new ValidationError($message, $snippet, $selection);
  }

  public static function expectedFieldGotSection(stdClass $context, stdClass $instruction) : ValidationError {
    $message = $context->messages->expectedFieldGotSection($instruction->key);

    $snippet = $context->reporter::report($context, array_merge([$instruction], $instruction->subinstructions));

    $selection = [[$instruction->line, 0]];
    if(count($instruction->subinstructions) > 0) {
      $last_instruction = $instruction->subinstructions[count($instruction->subinstructions) - 1];
      $selection[] = [$last_instruction->line, $last_instruction->length];
    } else {
      $selection[] = [$instruction->line, $instruction->length];
    }

    return new ValidationError($message, $snippet, $selection);
  }

  public static function expectedFieldsGotFieldset(stdClass $context, stdClass $instruction) : ValidationError {
    $message = $context->messages->expectedFieldsGotFieldset($instruction->key);

    $snippet = $context->reporter::report($context, array_merge([$instruction], $instruction->subinstructions));

    $selection = [[$instruction->line, 0]];
    if(count($instruction->subinstructions) > 0) {
      $last_instruction = $instruction->subinstructions[count($instruction->subinstructions) - 1];
      $selection[] = [$last_instruction->line, $last_instruction->length];
    } else {
      $selection[] = [$instruction->line, $instruction->length];
    }

    return new ValidationError($message, $snippet, $selection);
  }

  public static function expectedFieldsGotList(stdClass $context, stdClass $instruction) : ValidationError {
    $message = $context->messages->expectedFieldsGotList($instruction->key);

    $snippet = $context->reporter::report($context, array_merge([$instruction], $instruction->subinstructions));

    $selection = [[$instruction->line, 0]];
    if(count($instruction->subinstructions) > 0) {
      $last_instruction = $instruction->subinstructions[count($instruction->subinstructions) - 1];
      $selection[] = [$last_instruction->line, $last_instruction->length];
    } else {
      $selection[] = [$instruction->line, $instruction->length];
    }

    return new ValidationError($message, $snippet, $selection);
  }

  public static function expectedFieldsGotSection(stdClass $context, stdClass $instruction) : ValidationError {
    $message = $context->messages->expectedFieldsGotSection($instruction->key);

    $snippet = $context->reporter::report($context, array_merge([$instruction], $instruction->subinstructions));

    $selection = [[$instruction->line, 0]];
    if(count($instruction->subinstructions) > 0) {
      $last_instruction = $instruction->subinstructions[count($instruction->subinstructions) - 1];
      $selection[] = [$last_instruction->line, $last_instruction->length];
    } else {
      $selection[] = [$instruction->line, $instruction->length];
    }

    return new ValidationError($message, $snippet, $selection);
  }

  public static function expectedListGotFieldset(stdClass $context, stdClass $instruction) : ValidationError {
    $message = $context->messages->expectedListGotFieldset($instruction->key);

    $snippet = $context->reporter::report($context, array_merge([$instruction], $instruction->subinstructions));

    $selection = [[$instruction->line, 0]];
    if(count($instruction->subinstructions) > 0) {
      $last_instruction = $instruction->subinstructions[count($instruction->subinstructions) - 1];
      $selection[] = [$last_instruction->line, $last_instruction->length];
    } else {
      $selection[] = [$instruction->line, $instruction->length];
    }

    return new ValidationError($message, $snippet, $selection);
  }

  public static function expectedListGotField(stdClass $context, stdClass $instruction) : ValidationError {
    $message = $context->messages->expectedListGotField($instruction->key);

    $snippet = $context->reporter::report($context, array_merge([$instruction], $instruction->subinstructions));

    $selection = [[$instruction->line, 0]];
    if(count($instruction->subinstructions) > 0) {
      $last_instruction = $instruction->subinstructions[count($instruction->subinstructions) - 1];
      $selection[] = [$last_instruction->line, $last_instruction->length];
    } else {
      $selection[] = [$instruction->line, $instruction->length];
    }

    return new ValidationError($message, $snippet, $selection);
  }

  public static function expectedListGotLists(stdClass $context, string $key, array $instructions) : ValidationError {
    $expanded_instructions = expandInstructions($instructions);
    $last_instruction = $expanded_instructions[count($expanded_instructions) - 1];

    $message = $context->messages->expectedListGotLists($key);

    $snippet = $context->reporter::report($context, $instructions, $expanded_instructions);

    $selection = [
      [$expanded_instructions[0]->line, 0],
      [$last_instruction->line, $last_instruction->length]
    ];

    return new ValidationError($message, $snippet, $selection);
  }

  public static function expectedListGotSection(stdClass $context, stdClass $instruction) : ValidationError {
    $message = $context->messages->expectedListGotSection($instruction->key);

    $snippet = $context->reporter::report($context, array_merge([$instruction], $instruction->subinstructions));

    $selection = [[$instruction->line, 0]];
    if(count($instruction->subinstructions) > 0) {
      $last_instruction = $instruction->subinstructions[count($instruction->subinstructions) - 1];
      $selection[] = [$last_instruction->line, $last_instruction->length];
    } else {
      $selection[] = [$instruction->line, $instruction->length];
    }

    return new ValidationError($message, $snippet, $selection);
  }

  public static function expectedListsGotFieldset(stdClass $context, stdClass $instruction) : ValidationError {
    $message = $context->messages->expectedListsGotFieldset($instruction->key);

    $snippet = $context->reporter::report($context, array_merge([$instruction], $instruction->subinstructions));

    $selection = [[$instruction->line, 0]];
    if(count($instruction->subinstructions) > 0) {
      $last_instruction = $instruction->subinstructions[count($instruction->subinstructions) - 1];
      $selection[] = [$last_instruction->line, $last_instruction->length];
    } else {
      $selection[] = [$instruction->line, $instruction->length];
    }

    return new ValidationError($message, $snippet, $selection);
  }

  public static function expectedListsGotField(stdClass $context, stdClass $instruction) : ValidationError {
    $message = $context->messages->expectedListsGotField($instruction->key);

    $snippet = $context->reporter::report($context, array_merge([$instruction], $instruction->subinstructions));

    $selection = [[$instruction->line, 0]];
    if(count($instruction->subinstructions) > 0) {
      $last_instruction = $instruction->subinstructions[count($instruction->subinstructions) - 1];
      $selection[] = [$last_instruction->line, $last_instruction->length];
    } else {
      $selection[] = [$instruction->line, $instruction->length];
    }

    return new ValidationError($message, $snippet, $selection);
  }

  public static function expectedListsGotSection(stdClass $context, stdClass $instruction) : ValidationError {
    $message = $context->messages->expectedListsGotSection($instruction->key);

    $snippet = $context->reporter::report($context, array_merge([$instruction], $instruction->subinstructions));

    $selection = [[$instruction->line, 0]];
    if(count($instruction->subinstructions) > 0) {
      $last_instruction = $instruction->subinstructions[count($instruction->subinstructions) - 1];
      $selection[] = [$last_instruction->line, $last_instruction->length];
    } else {
      $selection[] = [$instruction->line, $instruction->length];
    }

    return new ValidationError($message, $snippet, $selection);
  }

  public static function expectedSectionGotFieldset(stdClass $context, stdClass $instruction) : ValidationError {
    $message = $context->messages->expectedSectionGotFieldset($instruction->key);

    $snippet = $context->reporter::report($context, array_merge([$instruction], $instruction->subinstructions));

    $selection = [[$instruction->line, 0]];
    if(count($instruction->subinstructions) > 0) {
      $last_instruction = $instruction->subinstructions[count($instruction->subinstructions) - 1];
      $selection[] = [$last_instruction->line, $last_instruction->length];
    } else {
      $selection[] = [$instruction->line, $instruction->length];
    }

    return new ValidationError($message, $snippet, $selection);
  }

  public static function expectedSectionGotEmpty(stdClass $context, stdClass $instruction) : ValidationError {
    $message = $context->messages->expectedSectionGotEmpty($instruction->key);

    $snippet = $context->reporter::report($context, $instruction);

    $selection = [
      [$instruction->line, 0],
      [$instruction->line, $instruction->length]
    ];

    return new ValidationError($message, $snippet, $selection);
  }

  public static function expectedSectionGotField(stdClass $context, stdClass $instruction) : ValidationError {
    $message = $context->messages->expectedSectionGotField($instruction->key);

    $snippet = $context->reporter::report($context, array_merge([$instruction], $instruction->subinstructions));

    $selection = [[$instruction->line, 0]];
    if(count($instruction->subinstructions) > 0) {
      $last_instruction = $instruction->subinstructions[count($instruction->subinstructions) - 1];
      $selection[] = [$last_instruction->line, $last_instruction->length];
    } else {
      $selection[] = [$instruction->line, $instruction->length];
    }

    return new ValidationError($message, $snippet, $selection);
  }

  public static function expectedSectionGotList(stdClass $context, stdClass $instruction) : ValidationError {
    $message = $context->messages->expectedSectionGotList($instruction->key);

    $snippet = $context->reporter::report($context, array_merge([$instruction], $instruction->subinstructions));

    $selection = [[$instruction->line, 0]];
    if(count($instruction->subinstructions) > 0) {
      $last_instruction = $instruction->subinstructions[count($instruction->subinstructions) - 1];
      $selection[] = [$last_instruction->line, $last_instruction->length];
    } else {
      $selection[] = [$instruction->line, $instruction->length];
    }

    return new ValidationError($message, $snippet, $selection);
  }

  public static function expectedSectionGotSections(stdClass $context, string $key, array $instructions) : ValidationError {
    $expanded_instructions = expandInstructions($instructions);
    $last_instruction = $expanded_instructions[count($expanded_instructions) - 1];

    $message = $context->messages->expectedSectionGotSections($key);

    $snippet = $context->reporter::report($context, $instructions, $expanded_instructions);

    $selection = [
      [$expanded_instructions[0]->line, 0],
      [$last_instruction->line, $last_instruction->length]
    ];

    return new ValidationError($message, $snippet, $selection);
  }

  public static function expectedSectionsGotFieldset(stdClass $context, stdClass $instruction) : ValidationError {
    $message = $context->messages->expectedSectionsGotFieldset($instruction->key);

    $snippet = $context->reporter::report($context, array_merge([$instruction], $instruction->subinstructions));

    $selection = [[$instruction->line, 0]];
    if(count($instruction->subinstructions) > 0) {
      $last_instruction = $instruction->subinstructions[count($instruction->subinstructions) - 1];
      $selection[] = [$last_instruction->line, $last_instruction->length];
    } else {
      $selection[] = [$instruction->line, $instruction->length];
    }

    return new ValidationError($message, $snippet, $selection);
  }

  public static function expectedSectionsGotEmpty(stdClass $context, stdClass $instruction) : ValidationError {
    $message = $context->messages->expectedSectionsGotEmpty($instruction->key);

    $snippet = $context->reporter::report($context, array_merge([$instruction], $instruction->subinstructions));

    $selection = [[$instruction->line, 0]];
    if(count($instruction->subinstructions) > 0) {
      $last_instruction = $instruction->subinstructions[count($instruction->subinstructions) - 1];
      $selection[] = [$last_instruction->line, $last_instruction->length];
    } else {
      $selection[] = [$instruction->line, $instruction->length];
    }

    return new ValidationError($message, $snippet, $selection);
  }

  public static function expectedSectionsGotField(stdClass $context, stdClass $instruction) : ValidationError {
    $message = $context->messages->expectedSectionsGotField($instruction->key);

    $snippet = $context->reporter::report($context, array_merge([$instruction], $instruction->subinstructions));

    $selection = [[$instruction->line, 0]];
    if(count($instruction->subinstructions) > 0) {
      $last_instruction = $instruction->subinstructions[count($instruction->subinstructions) - 1];
      $selection[] = [$last_instruction->line, $last_instruction->length];
    } else {
      $selection[] = [$instruction->line, $instruction->length];
    }

    return new ValidationError($message, $snippet, $selection);
  }

  public static function expectedSectionsGotList(stdClass $context, stdClass $instruction) : ValidationError {
    $message = $context->messages->expectedSectionsGotList($instruction->key);

    $snippet = $context->reporter::report($context, array_merge([$instruction], $instruction->subinstructions));

    $selection = [[$instruction->line, 0]];
    if(count($instruction->subinstructions) > 0) {
      $last_instruction = $instruction->subinstructions[count($instruction->subinstructions) - 1];
      $selection[] = [$last_instruction->line, $last_instruction->length];
    } else {
      $selection[] = [$instruction->line, $instruction->length];
    }

    return new ValidationError($message, $snippet, $selection);
  }

  public static function keyError(stdClass $context, string $message, stdClass $instruction) : ValidationError {
    $message = $context->messages->keyError($message);
    $snippet = $context->reporter::report($context, $instruction);

    $selection = [
      [$instruction->line, $instruction->ranges['key'][0]],
      [$instruction->line, $instruction->ranges['key'][1]]
    ];

    return new ValidationError($message, $snippet, $selection);
  }

  // TODO: Exclude sections within sections for all the missing* errors (except missingFieldsetEntry)

  public static function missingFieldset(stdClass $context, string $key, stdClass $section_instruction) : ValidationError {
    $message = $context->messages->missingFieldset($key);

    $snippet = $context->reporter::report($context, $section_instruction, deepExpandInstruction($section_instruction));

    $selection = [
      [$section_instruction->line, $section_instruction->length],
      [$section_instruction->line, $section_instruction->length]
    ];

    return new ValidationError($message, $snippet, $selection);
  }

  public static function missingFieldsetEntry(stdClass $context, string $key, stdClass $fieldset_instruction) : ValidationError {
    $message = $context->messages->missingFieldsetEntry($key);

    $snippet = $context->reporter::report($context, $fieldset_instruction, deepExpandInstruction($fieldset_instruction));

    $selection = [
      [$fieldset_instruction->line, $fieldset_instruction->length],
      [$fieldset_instruction->line, $fieldset_instruction->length]
    ];

    return new ValidationError($message, $snippet, $selection);
  }

  public static function missingElement(stdClass $context, string $key, stdClass $section_instruction) : ValidationError {
    $message = $context->messages->missingElement($key);

    $snippet = $context->reporter::report($context, $section_instruction, deepExpandInstruction($section_instruction));

    $selection = [
      [$section_instruction->line, $section_instruction->length],
      [$section_instruction->line, $section_instruction->length]
    ];

    return new ValidationError($message, $snippet, $selection);
  }

  public static function missingField(stdClass $context, string $key, stdClass $section_instruction) : ValidationError {
    $message = $context->messages->missingField($key);

    $snippet = $context->reporter::report($context, $section_instruction, deepExpandInstruction($section_instruction));

    $selection = [
      [$section_instruction->line, $section_instruction->length],
      [$section_instruction->line, $section_instruction->length]
    ];

    return new ValidationError($message, $snippet, $selection);
  }

  public static function missingList(stdClass $context, string $key, stdClass $section_instruction) : ValidationError {
    $message = $context->messages->missingList($key);

    $snippet = $context->reporter::report($context, $section_instruction, deepExpandInstruction($section_instruction));

    $selection = [
      [$section_instruction->line, $section_instruction->length],
      [$section_instruction->line, $section_instruction->length]
    ];

    return new ValidationError($message, $snippet, $selection);
  }

  public static function missingSection(stdClass $context, string $key, stdClass $section_instruction) : ValidationError {
    $message = $context->messages->missingSection($key);

    $snippet = $context->reporter::report($context, $section_instruction, deepExpandInstruction($section_instruction));

    $selection = [
      [$section_instruction->line, $section_instruction->length],
      [$section_instruction->line, $section_instruction->length]
    ];

    return new ValidationError($message, $snippet, $selection);
  }

  // TODO: Revisit and polish the two core value errors again at some point (missingValue / valueError)
  //       (In terms of quality of results and architecture - DRY up probably)
  //       Share best implementation among other eno libraries

  public static function missingValue(stdClass $context, stdClass $instruction) : ValidationError {
    $message = null;
    $selection = null;

    if($instruction->type === 'FIELD' || $instruction->type === 'ELEMENT' || $instruction->type === 'MULTILINE_FIELD_BEGIN') {
      $message = $context->messages->missingFieldValue($instruction->key);

      if(array_key_exists('template', $instruction->ranges)) {
        $selection = [[$instruction->line, $instruction->ranges['template'][1]]];
      } else if(array_key_exists('element_operator', $instruction->ranges)) {
        $selection = [[
          $instruction->line,
          min($instruction->ranges['element_operator'][1] + 1, $instruction->length)
        ]];
      } else {
        $selection = [[$instruction->line, $instruction->length]];
      }
    } else if($instruction->type === 'FIELDSET_ENTRY') {
      $message = $context->messages->missingFieldsetEntryValue($instruction->key);
      $selection = [[
        $instruction->line,
        min($instruction->ranges['entry_operator'][1] + 1, $instruction->length)
      ]];
    } else if($instruction->type === 'LIST_ITEM') {
      $message = $context->messages->missingListItemValue($instruction->key);
      $selection = [[
        $instruction->line,
        min($instruction->ranges['item_operator'][1] + 1, $instruction->length)
      ]];
    }

    $snippet = $context->reporter::report($context, $instruction, deepExpandInstruction($instruction));

    if($instruction->type != 'MULTILINE_FIELD_BEGIN' &&
       array_key_exists('subinstructions', $instruction) && count($instruction->subinstructions) > 0) {
      $last_instruction = $instruction->subinstructions[count($instruction->subinstructions) - 1];
      $selection[] = [$last_instruction->line, $last_instruction->length];
    } else {
      $selection[] = [$instruction->line, $instruction->length];
    }

    return new ValidationError($message, $snippet, $selection);
  }

  public static function valueError(stdClass $context, ?string $message, stdClass $instruction) : ValidationError {
    if($message === null) {
      $message = $context->messages->genericError($instruction->key);
    }

    $snippet = null;
    $selection = null;

    if($instruction->type === 'MULTILINE_FIELD_BEGIN') {
      $content_instructions = array_filter(
        function($instruction) { return $instruction->type === 'MULTILINE_FIELD_VALUE'; },
        $instruction->subinstructions
      );
      $terminator_instruction = $instruction->subinstructions[count($instruction->subinstructions) - 1];

      if(count($content_instructions) > 0) {
        $first_instruction = $content_instructions[0];
        $last_instruction = $content_instructions[count($content_instructions) - 1];

        $snippet = $context->reporter::report($context, $content_instructions);
        $selection = [
          [$first_instruction->line, $first_instruction->ranges['content'][0]],
          [$last_instruction->line, $last_instruction->ranges['content'][1]]
        ];
      } else {
        $snippet = $context->reporter::report($context, [$instruction, $terminator_instruction]);
        $selection = [
          [$instruction->line, $instruction->length],
          [$instruction->line, $instruction->length]
        ];
      }
    } else {
      $snippet = $context->reporter::report($context, deepExpandInstruction($instruction));

      if(array_key_exists('value', $instruction->ranges)) {
        $selection = [[$instruction->line, $instruction->ranges['value'][0]]];
      } else if(array_key_exists('template', $instruction->ranges)) {
        $selection = [[$instruction->line, $instruction->ranges['template_operator'][0]]];
      } else if(array_key_exists('element_operator', $instruction->ranges)) {
        $selection = [[
          $instruction->line,
          min($instruction->ranges['element_operator'][1] + 1, $instruction->length)
        ]];
      } else if(array_key_exists('entry_operator', $instruction->ranges)) {
        $selection = [[
          $instruction->line,
          min($instruction->ranges['entry_operator'][1] + 1, $instruction->length)
        ]];
      } else if($instruction->type === 'LIST_ITEM') {
        $selection = [[
          $instruction->line,
          min($instruction->ranges['item_operator'][1] + 1, $instruction->length)
        ]];
      } else {
        $selection = [[$instruction->line, $instruction->length]];
      }

      if(array_key_exists('subinstructions', $instruction) && count($instruction->subinstructions) > 0) {
        $last_instruction = $instruction->subinstructions[count($instruction->subinstructions) - 1];
        $selection[] = [$last_instruction->line, $last_instruction->length];
      } else {
        if(array_key_exists('value', $instruction->ranges)) {
          $selection[] = [$instruction->line, $instruction->ranges['value'][1]];
        } else {
          $selection[] = [$instruction->line, $instruction->length];
        }
      }
    }

    return new ValidationError($message, $snippet, $selection);
  }
}
