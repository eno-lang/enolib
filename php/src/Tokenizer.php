<?php declare(strict_types=1);

namespace Eno;
use \stdClass;
use Eno\Errors\Parsing;
use Eno\Grammar;

class Tokenizer {
  function __construct(stdClass $context) {
    $this->context = $context;
    $this->index = 0;
    $this->line = 0;

    $this->context->instructions = [];
  }

  function tokenizeErrorContext(stdClass $context) : stdClass {
    $first_instruction = null;

    while(true) {
      $end_of_line_column = strpos($context->input, "\n", $this->index);

      if($end_of_line_column === false) {
        $instruction = (object) [
          'index' => $this->index,
          'length' => strlen($context->input) - $this->index,
          'line' => $this->line
        ];

        $context->instructions[] = $instruction;

        if($first_instruction === null) {
          $first_instruction = $instruction;
        }

        return $first_instruction;
      } else {
        $instruction = (object) [
          'index' => $this->index,
          'length' => $end_of_line_column - $this->index,
          'line' => $this->line
        ];

        $context->instructions[] = $instruction;

        if($first_instruction === null) {
          $first_instruction = $instruction;
        }

        $this->index = $end_of_line_column + 1;
        $this->line++;
      }
    }
  }

  function tokenize() : void {
    $instruction = [];

    while(true) {
      $matched = preg_match(Grammar::REGEX, $this->context->input, $match, PREG_OFFSET_CAPTURE | PREG_UNMATCHED_AS_NULL, $this->index);

      if($matched != 1 || $match[0][1] != $this->index) {
        $instruction = $this->tokenizeErrorContext($this->context, $this->index, $this->line);
        throw Parsing::invalidLine($this->context, $instruction);
      }

      $instruction = (object) [
        'index' => $this->index,
        'line' => $this->line++
      ];

      $multiline_field = false;

      if(isset($match[Grammar::EMPTY_LINE_INDEX][0])) {

        $instruction->type = 'EMPTY_LINE';

      } else if(isset($match[Grammar::ELEMENT_OPERATOR_INDEX][0])) {

        $element_operator_column = $match[Grammar::ELEMENT_OPERATOR_INDEX][1] - $this->index;

        if(isset($match[Grammar::KEY_UNESCAPED_INDEX][0])) {
          $key = $match[Grammar::KEY_UNESCAPED_INDEX][0];
          $key_column = $match[Grammar::KEY_UNESCAPED_INDEX][1] - $this->index;

          $instruction->key = $key;
          $instruction->ranges = [  // TODO: Here and elsewhere have ranges be an object too ?
            'element_operator' => [$element_operator_column, $element_operator_column + 1],
            'key' => [$key_column, $key_column + strlen($key)]
          ];
        } else {
          $key = $match[Grammar::KEY_ESCAPED_INDEX][0];
          $escape_operator = $match[Grammar::KEY_ESCAPE_BEGIN_OPERATOR_INDEX][0];
          $escape_begin_operator_column = $match[Grammar::KEY_ESCAPE_BEGIN_OPERATOR_INDEX][1] - $this->index;
          $key_column = $match[Grammar::KEY_ESCAPED_INDEX][1] - $this->index;
          $escape_end_operator_column = $match[Grammar::KEY_ESCAPE_END_OPERATOR_INDEX][1] - $this->index;

          $instruction->key = $key;
          $instruction->ranges = [
            'escape_begin_operator' => [$escape_begin_operator_column, $escape_begin_operator_column + strlen($escape_operator)],
            'escape_end_operator' => [$escape_end_operator_column, $escape_end_operator_column + strlen($escape_operator)],
            'element_operator' => [$element_operator_column, $element_operator_column + 1],
            'key' => [$key_column, $key_column + strlen($key)]
          ];
        }

        if(isset($match[Grammar::FIELD_VALUE_INDEX][0])) {
          $value = $match[Grammar::FIELD_VALUE_INDEX][0];
          $instruction->type = 'FIELD';
          $instruction->value = $value;

          $value_column = $match[Grammar::FIELD_VALUE_INDEX][1] - $this->index;
          $instruction->ranges['value'] = [$value_column, $value_column + strlen($value)];
        } else {
          $instruction->type = 'ELEMENT';
        }

      } else if(isset($match[Grammar::LIST_ITEM_OPERATOR_INDEX][0])) {

        $operator_column = $match[Grammar::LIST_ITEM_OPERATOR_INDEX][1] - $this->index;

        $instruction->ranges = [ 'item_operator' => [$operator_column, $operator_column + 1] ];
        $instruction->type = 'LIST_ITEM';

        if(isset($match[Grammar::LIST_ITEM_VALUE_INDEX][0])) {
          $instruction->value = $match[Grammar::LIST_ITEM_VALUE_INDEX][0];
          $value_column = $match[Grammar::LIST_ITEM_VALUE_INDEX][1] - $this->index;
          $instruction->ranges['value'] = [$value_column, $value_column + strlen($instruction->value)];
        } else {
          $instruction->value = null;
        }

      } else if(isset($match[Grammar::FIELDSET_ENTRY_OPERATOR_INDEX][0])) {

        $entry_operator_column = $match[Grammar::FIELDSET_ENTRY_OPERATOR_INDEX][1] - $this->index;

        if(isset($match[Grammar::KEY_UNESCAPED_INDEX][0])) {
          $key = $match[Grammar::KEY_UNESCAPED_INDEX][0];
          $key_column = $match[Grammar::KEY_UNESCAPED_INDEX][1] - $this->index;

          $instruction->key = $key;
          $instruction->ranges = [
            'entry_operator' => [$entry_operator_column, $entry_operator_column + 1],
            'key' => [$key_column, $key_column + strlen($key)]
          ];
        } else {
          $escape_operator = $match[Grammar::KEY_ESCAPE_BEGIN_OPERATOR_INDEX][0];
          $key = $match[Grammar::KEY_ESCAPED_INDEX][0];
          $escape_begin_operator_column = $match[Grammar::KEY_ESCAPE_BEGIN_OPERATOR_INDEX][1] - $this->index;
          $key_column = $match[Grammar::KEY_ESCAPED_INDEX][1] - $this->index;
          $escape_end_operator_column = $match[Grammar::KEY_ESCAPE_END_OPERATOR_INDEX][1] - $this->index;

          $instruction->key = $key;
          $instruction->ranges = [
            'escape_begin_operator' => [$escape_begin_operator_column, $escape_begin_operator_column + strlen($escape_operator)],
            'escape_end_operator' => [$escape_end_operator_column, $escape_end_operator_column + strlen($escape_operator)],
            'entry_operator' => [$entry_operator_column, $entry_operator_column + 1],
            'key' => [$key_column, $key_column + strlen($key)]
          ];
        }

        $instruction->type = 'FIELDSET_ENTRY';

        if(isset($match[Grammar::FIELDSET_ENTRY_VALUE_INDEX][0])) {
          $value = $match[Grammar::FIELDSET_ENTRY_VALUE_INDEX][0];
          $value_column = $match[Grammar::FIELDSET_ENTRY_VALUE_INDEX][1] - $this->index;
          $instruction->ranges['value'] = [$value_column, $value_column + strlen($value)];
          $instruction->value = $value;
        } else {
          $instruction->value = null;
        }

      } else if(isset($match[Grammar::SPACED_LINE_CONTINUATION_OPERATOR_INDEX][0])) {

        $operator_column = $match[Grammar::SPACED_LINE_CONTINUATION_OPERATOR_INDEX][1] - $this->index;

        $instruction->ranges = [ 'spaced_line_continuation_operator' => [$operator_column, $operator_column + 1] ];
        $instruction->spaced = true;
        $instruction->type = 'CONTINUATION';

        if(isset($match[Grammar::SPACED_LINE_CONTINUATION_VALUE_INDEX][0])) {
          $value = $match[Grammar::SPACED_LINE_CONTINUATION_VALUE_INDEX][0];
          $value_column = $match[Grammar::SPACED_LINE_CONTINUATION_VALUE_INDEX][1] - $this->index;

          $instruction->value = $value;
          $instruction->ranges['value'] = [$value_column, $value_column + strlen($value)];
        } else {
          $instruction->value = null;
        }

      } else if(isset($match[Grammar::DIRECT_LINE_CONTINUATION_OPERATOR_INDEX][0])) {

        $operator_column = $match[Grammar::DIRECT_LINE_CONTINUATION_OPERATOR_INDEX][1] - $this->index;

        $instruction->ranges = [ 'direct_line_continuation_operator' => [$operator_column, $operator_column + 1] ];
        $instruction->spaced = false;
        $instruction->type = 'CONTINUATION';

        if(isset($match[Grammar::DIRECT_LINE_CONTINUATION_VALUE_INDEX][0])) {
          $value = $match[Grammar::DIRECT_LINE_CONTINUATION_VALUE_INDEX][0];
          $value_column = $match[Grammar::DIRECT_LINE_CONTINUATION_VALUE_INDEX][1] - $this->index;

          $instruction->value = $value;
          $instruction->ranges['value'] = [$value_column, $value_column + strlen($value)];
        } else {
          $instruction->value = null;
        }

      } else if(isset($match[Grammar::SECTION_OPERATOR_INDEX][0])) {

        $section_operator = $match[Grammar::SECTION_OPERATOR_INDEX][0];

        $instruction->depth = strlen($section_operator);
        $instruction->type = 'SECTION';

        $section_operator_column = $match[Grammar::SECTION_OPERATOR_INDEX][1] - $this->index;
        $key_end_column = null;

        if(isset($match[Grammar::SECTION_KEY_UNESCAPED_INDEX][0])) {
          $key = $match[Grammar::SECTION_KEY_UNESCAPED_INDEX][0];

          $key_column = $match[Grammar::SECTION_KEY_UNESCAPED_INDEX][1] - $this->index;
          $key_end_column = $key_column + strlen($key);

          $instruction->key = $key;
          $instruction->ranges = [
            'key' => [$key_column, $key_column + strlen($key)],
            'section_operator' => [$section_operator_column, $section_operator_column + strlen($section_operator)]
          ];
        } else {
          $key = $match[Grammar::SECTION_KEY_ESCAPED_INDEX][0];

          $escape_operator = $match[Grammar::SECTION_KEY_ESCAPE_BEGIN_OPERATOR_INDEX][0];
          $key = $match[Grammar::SECTION_KEY_ESCAPED_INDEX][0];
          $escape_begin_operator_column = $match[Grammar::SECTION_KEY_ESCAPE_BEGIN_OPERATOR_INDEX][1] - $this->index;
          $key_column = $match[Grammar::SECTION_KEY_ESCAPED_INDEX][1] - $this->index;
          $escape_end_operator_column = $match[Grammar::SECTION_KEY_ESCAPE_END_OPERATOR_INDEX][1] - $this->index;

          $instruction->key = $key;
          $instruction->ranges = [
            'escape_begin_operator' => [$escape_begin_operator_column, $escape_begin_operator_column + strlen($escape_operator)],
            'escape_end_operator' => [$escape_end_operator_column, $escape_end_operator_column + strlen($escape_operator)],
            'key' => [$key_column, $key_column + strlen($key)],
            'section_operator' => [$section_operator_column, $section_operator_column + strlen($section_operator)]
          ];
        }

        if(isset($match[Grammar::SECTION_TEMPLATE_INDEX][0])) {
          $template = $match[Grammar::SECTION_TEMPLATE_INDEX][0];
          $instruction->template = $template;

          $copy_operator = $match[Grammar::SECTION_COPY_OPERATOR_INDEX][0];
          $copy_operator_column = $match[Grammar::SECTION_COPY_OPERATOR_INDEX][1] - $this->index;
          $template_column = $match[Grammar::SECTION_TEMPLATE_INDEX][1] - $this->index;

          if($copy_operator === '<') {
            $instruction->deep_copy = false;
            $instruction->ranges['copy_operator'] = [$copy_operator_column, $copy_operator_column + strlen($copy_operator)];
          } else { // copy_operator === '<<'
            $instruction->deep_copy = true;
            $instruction->ranges['deep_copy_operator'] = [$copy_operator_column, $copy_operator_column + strlen($copy_operator)];
          }

          $instruction->ranges['template'] = [$template_column, $template_column + strlen($template)];
        }

      } else if(isset($match[Grammar::MULTILINE_FIELD_OPERATOR_INDEX][0])) {

        $operator = $match[Grammar::MULTILINE_FIELD_OPERATOR_INDEX][0];
        $key = $match[Grammar::MULTILINE_FIELD_KEY_INDEX][0];
        $instruction->key = $key;
        $instruction->type = 'MULTILINE_FIELD_BEGIN';

        $operator_column = $match[Grammar::MULTILINE_FIELD_OPERATOR_INDEX][1] - $this->index;
        $key_column = $match[Grammar::MULTILINE_FIELD_KEY_INDEX][1] - $this->index;
        $instruction->length = strlen($match[0][0]);
        $instruction->ranges = [
          'multiline_field_operator' => [$operator_column, $operator_column + strlen($operator)],
          'key' => [$key_column, $key_column + strlen($key)]
        ];

        $this->index = $this->index + $instruction->length + 1;

        $this->context->instructions[] = $instruction;

        $start_of_multiline_field_column = $this->index;

        $key_escaped = preg_quote($instruction->key);
        $terminator_regex = "/[^\\S\\n]*(${operator})(?!-)[^\\S\\n]*(${key_escaped})[^\\S\\n]*(?=\\n|$)/A";

        while(true) {
          $matched = preg_match($terminator_regex, $this->context->input, $terminator_match, PREG_OFFSET_CAPTURE | PREG_UNMATCHED_AS_NULL, $this->index);

          if($matched === 1) {
            if($this->line > $instruction->line + 1) {
              $instruction->value_range = [$start_of_multiline_field_column, $this->index - 2];
            }

            $operator_column = $terminator_match[1][1] - $this->index;
            $key_column = $terminator_match[2][1] - $this->index;

            $instruction = (object) [
              'index' => $this->index,
              'length' => strlen($terminator_match[0][0]),
              'line' => $this->line,
              'ranges' => [
                'multiline_field_operator' => [$operator_column, $operator_column + strlen($operator)],
                'key' => [$key_column, $key_column + strlen($key)]
              ],
              'type' => 'MULTILINE_FIELD_END'
            ];

            $this->context->instructions[] = $instruction;
            $this->index = $this->index + $instruction->length + 1;
            $this->line++;

            $multiline_field = true;

            break;
          } else {
            $end_of_line_column = strpos($this->context->input, "\n", $this->index);

            if($end_of_line_column === false) {
              $this->context->instructions[] = (object) [
                'index' => $this->index,
                'length' => strlen($this->context->input) - $this->index,
                'line' => $this->line
              ];

              throw Parsing::unterminatedMultilineField($this->context, $instruction);
            } else {
              $this->context->instructions[] = (object) [
                'index' => $this->index,
                'length' => $end_of_line_column - $this->index,
                'line' => $this->line,
                'ranges' => [ 'content' => [0, $end_of_line_column - $this->index] ],
                'type' => 'MULTILINE_FIELD_VALUE'
              ];

              $this->index = $end_of_line_column + 1;
              $this->line++;
            }
          }
        }

      } else if(isset($match[Grammar::TEMPLATE_INDEX][0])) {

        $template = $match[Grammar::TEMPLATE_INDEX][0];
        $copy_operator = $match[Grammar::COPY_OPERATOR_INDEX][0];
        $copy_operator_column = $match[Grammar::COPY_OPERATOR_INDEX][1] - $this->index;

        if(isset($match[Grammar::KEY_UNESCAPED_INDEX][0])) {
          $key = $match[Grammar::KEY_UNESCAPED_INDEX][0];

          $key_column = $match[Grammar::KEY_UNESCAPED_INDEX][1] - $this->index;

          $instruction->key = $key;
          $instruction->ranges = [
            'copy_operator' => [$copy_operator_column, $copy_operator_column + strlen($copy_operator)],
            'key' => [$key_column, $key_column + strlen($instruction->key)]
          ];
        } else {
          $key = $match[Grammar::KEY_ESCAPED_INDEX][0];

          $escape_operator = $match[Grammar::KEY_ESCAPE_BEGIN_OPERATOR_INDEX][0];
          $escape_begin_operator_column = $match[Grammar::KEY_ESCAPE_BEGIN_OPERATOR_INDEX][1] - $this->index;
          $key_column = $match[Grammar::KEY_ESCAPED_INDEX][1] - $this->index;
          $escape_end_operator_column = $match[Grammar::KEY_ESCAPE_END_OPERATOR_INDEX][1] - $this->index;

          $instruction->key = $key;
          $instruction->ranges = [
            'copy_operator' => [$copy_operator_column, $copy_operator_column + strlen($copy_operator)],
            'escape_begin_operator' => [$escape_begin_operator_column, $escape_begin_operator_column + strlen($escape_operator)],
            'escape_end_operator' => [$escape_end_operator_column, $escape_end_operator_column + strlen($escape_operator)],
            'key' => [$key_column, $key_column + strlen($key)]
          ];
        }

        $instruction->template = $template;
        $instruction->type = 'ELEMENT';

        $template_column = $match[Grammar::TEMPLATE_INDEX][1] - $this->index;
        $instruction->ranges['template'] = [$template_column, $template_column + strlen($template)];

      } else if(isset($match[Grammar::COMMENT_OPERATOR_INDEX][0])) {

        $operator_column = $match[Grammar::COMMENT_OPERATOR_INDEX][1] - $this->index;
        $value_column = $match[Grammar::COMMENT_VALUE_INDEX][1] - $this->index;

        $instruction->comment = $match[Grammar::COMMENT_VALUE_INDEX][0];
        $instruction->ranges = [
          'comment' => [$value_column, $value_column + strlen($instruction->comment)],
          'comment_operator' => [$operator_column, $operator_column + 1]
        ];
        $instruction->type = 'COMMENT';

      }

      if(!$multiline_field) {
        $instruction->length = $match[0][1] + strlen($match[0][0]) - $this->index;
        $this->index += $instruction->length + 1;
        $this->context->instructions[] = $instruction;
      }

      if($this->index >= strlen($this->context->input)) {
        if(strlen($this->context->input) > 0 && $this->context->input[strlen($this->context->input) - 1] === "\n") {
          $this->context->instructions[] = (object) [
            'index' => strlen($this->context->input),
            'length' => 0,
            'line' => $this->line,
            'type' => 'NOOP'
          ];
        }

        break;
      }
    } // ends while(true)
  }
}
