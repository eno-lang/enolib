<?php declare(strict_types=1);

namespace Eno\Errors;
use Eno\ParseError;
use \stdClass;

class Parsing {
  private const UNTERMINATED_ESCAPED_KEY = "/^\s*#*\s*(`+)(?!`)((?:(?!\1).)+)$/";

  public static function cyclicDependency(stdClass $context, stdClass $instruction, array $instruction_chain) : ParseError {
    $first_occurrence = array_search($instruction, $instruction_chain);
    $feedback_chain = array_slice($instruction_chain, $first_occurrence);
    $first_instruction = $feedback_chain[0];
    $last_instruction = $feedback_chain[count($feedback_chain) - 1];

    $copy_instruction = null;
    if(isset($last_instruction->template)) {
      $copy_instruction = $last_instruction;
    } else if($first_instruction->template) {
      $copy_instruction = $first_instruction;
    }

    $message = $context->messages->cyclicDependency(
      $copy_instruction->line + $context->indexing,
      $copy_instruction->template
    );

    $other_instructions = array_filter($feedback_chain, function($filter_instruction) use($copy_instruction) {
      return $filter_instruction !== $copy_instruction;
    });

    $snippet = $context->reporter::report($context, $copy_instruction, $other_instructions);

    $selection = [
      [$copy_instruction->line, $copy_instruction->ranges['template'][0]],
      [$copy_instruction->line, $copy_instruction->ranges['template'][1]]
    ];

    return new ParseError($message, $snippet, $selection);
  }

  static public function invalidLine(stdClass $context, stdClass $instruction) : ParseError {
    $line = substr($context->input, $instruction->index, $instruction->length);

    $matched = preg_match(self::UNTERMINATED_ESCAPED_KEY, $line, $match, PREG_OFFSET_CAPTURE | PREG_UNMATCHED_AS_NULL);;
    if($matched === 1) {
      return self::unterminatedEscapedKey($context, $instruction, $match[2][1]);
    }

    $message = $context->messages->invalidLine(
      $instruction->line + $context->indexing
    );

    $snippet = $context->reporter::report($context, $instruction);

    $selection = [
      [$instruction->line, 0],
      [$instruction->line, $instruction->length]
    ];

    return new ParseError($message, $snippet, $selection);
  }

  public static function lineContinuationOnCopiedElement(stdClass $context, stdClass $continuation_instruction, stdClass $element_instruction) : ParseError {
    $message = $context->messages::LINE_CONTINUATION_ON_COPIED_ELEMENT;
    $snippet = $context->reporter::report($context, $continuation_instruction, $element_instruction);

    $selection = [
      [$continuation_instruction->line, 0],
      [$continuation_instruction->line, $continuation_instruction->length]
    ];

    return new ParseError($message, $snippet, $selection);
  }

  public static function missingElementForContinuation(stdClass $context, stdClass $instruction) : ParseError {
    $message = $context->messages->missingElementForContinuation(
      $instruction->line + $context->indexing
    );

    $snippet = $context->reporter::report($context, $instruction);

    $selection = [
      [$instruction->line, 0],
      [$instruction->line, $instruction->length]
    ];

    return new ParseError($message, $snippet, $selection);
  }

  public static function missingFieldsetForFieldsetEntry(stdClass $context, stdClass $instruction) : ParseError {
    $message = $context->messages->missingFieldsetForFieldsetEntry(
      $instruction->line + $context->indexing
    );

    $snippet = $context->reporter::report($context, $instruction);

    $selection = [
      [$instruction->line, 0],
      [$instruction->line, $instruction->length]
    ];

    return new ParseError($message, $snippet, $selection);
  }

  public static function missingListForListItem(stdClass $context, stdClass $instruction) : ParseError {
    $message = $context->messages->missingListForListItem(
      $instruction->line + $context->indexing
    );

    $snippet = $context->reporter::report($context, $instruction);

    $selection = [
      [$instruction->line, 0],
      [$instruction->line, $instruction->length]
    ];

    return new ParseError($message, $snippet, $selection);
  }

  public static function multipleNonSectionElementTemplatesFound(stdClass $context, stdClass $instruction, array $templates) : ParseError {
    $message = $context->messages->multipleNonSectionElementTemplatesFound(
      $instruction->line + $context->indexing,
      $instruction->template
    );

    $snippet = $context->reporter::report($context, $instruction, $templates);

    $selection = [
      [$instruction->line, 0],
      [$instruction->line, $instruction->length]
    ];

    return new ParseError($message, $snippet, $selection);
  }

  public static function multipleSectionTemplatesFound(stdClass $context, stdClass $instruction, array $templates) : ParseError {
    $message = $context->messages->multipleSectionTemplatesFound(
      $instruction->line + $context->indexing,
      $instruction->template
    );

    $snippet = $context->reporter::report($context, $instruction, $templates);

    $selection = [
      [$instruction->line, 0],
      [$instruction->line, $instruction->length]
    ];

    return new ParseError($message, $snippet, $selection);
  }

  public static function nonSectionElementNotFound(stdClass $context, stdClass $instruction) : ParseError {
    $message = $context->messages->nonSectionElementNotFound(
      $instruction->line + $context->indexing,
      $instruction->template
    );
    $snippet = $context->reporter::report($context, $instruction);
    $selection = [
      [$instruction->line, 0],
      [$instruction->line, $instruction->length]
    ];

    return new ParseError($message, $snippet, $selection);
  }

  public static function sectionHierarchyLayerSkip(stdClass $context, stdClass $section_instruction, stdClass $super_section_instruction) : ParseError {
    $message = $context->messages->sectionHierarchyLayerSkip(
      $section_instruction->line + $context->indexing
    );

    $snippet = $context->reporter::report($context, $section_instruction, $super_section_instruction);

    $selection = [
      [$section_instruction->line, 0],
      [$section_instruction->line, $section_instruction->length]
    ];

    return new ParseError($message, $snippet, $selection);
  }

  public static function sectionNotFound(stdClass $context, stdClass $instruction) : ParseError {
    $message = $context->messages->sectionNotFound(
      $instruction->line + $context->indexing,
      $instruction->template
    );
    $snippet = $context->reporter::report($context, $instruction);
    $selection = [
      [$instruction->line, 0],
      [$instruction->line, $instruction->length]
    ];

    return new ParseError($message, $snippet, $selection);
  }

  // ```key: value
  static public function unterminatedEscapedKey(stdClass $context, stdClass $instruction, int $unterminated_column) : ParseError {
    $line = substr($context->input, $instruction->index, $instruction->length);

    $message = $context->messages->unterminatedEscapedKey(
      $instruction->line + $context->indexing
    );
    $snippet = $context->reporter::report($context, $instruction);

    $selection = [
      [$instruction->line, $unterminated_column],
      [$instruction->line, $instruction->length]
    ];

    return new ParseError($message, $snippet, $selection);
  }

  static public function unterminatedMultilineField(stdClass $context, stdClass $instruction) : ParseError {
    $multiline_field_content_instructions = array_filter($context->instructions, function($filter_instruction) use($instruction) {
      return $filter_instruction->line > $instruction->line;
    });

    $message = $context->messages->unterminatedMultilineField(
      $instruction->key,
      $instruction->line + $context->indexing
    );

    $snippet = $context->reporter::report(
      $context,
      $instruction,
      $multiline_field_content_instructions
    );

    $selection = [
      [$instruction->line, $instruction->ranges['multiline_field_operator'][0]],
      [$instruction->line, $instruction->ranges['key'][1]]
    ];

    return new ParseError($message, $snippet, $selection);
  }
}
