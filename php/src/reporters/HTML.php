<?php declare(strict_types=1);

namespace Eno\Reporters;
use \stdClass;

class HTML implements Reporter  {
  static private function line(string $gutter, string $content, array $classes = []) : string {
    $joined_classes = join(' ', $classes);
    $padded_gutter = str_pad($gutter, 10, ' ', STR_PAD_LEFT);
    $escaped_content = htmlspecialchars($content, ENT_QUOTES);

    $result  = "<div class=\"eno-report-line {$joined_classes}\">";
    $result .=   "<div class=\"eno-report-gutter\">{$padded_gutter}</div>";
    $result .=   "<div class=\"eno-report-content\">{$escaped_content}</div>";
    $result .= "</div>";

    return $result;
  }

  static public function report(stdClass $context, $emphasized = [], $marked = []) : string {
    if($emphasized instanceof stdClass) {
      $emphasized = [$emphasized];
    }

    if($marked instanceOf stdClass) {
      $marked = [$marked];
    }

    $content_header = $context->messages::CONTENT_HEADER;
    $gutter_header = str_pad($context->messages::GUTTER_HEADER, 5, ' ', STR_PAD_LEFT);
    $omission = self::line('...', '...');

    $snippet = '<pre class="eno-report">';

    if(isset($context->source_label)) {
      $snippet .= "<div>{$context->source_label}</div>";
    }

    $snippet .= self::line($gutter_header, $content_header);

    $in_omission = false;

    foreach($context->instructions as $instruction) {
      $emphasize = in_array($instruction, $emphasized);
      $mark = in_array($instruction, $marked);

      $show = false;
      foreach(array_merge($emphasized, $marked) as $marked_instruction) {
        if($instruction->line >= $marked_instruction->line - 2 &&
           $instruction->line <= $marked_instruction->line + 2) {
          $show = true;
          break;
        }
      }

      if($show) {
        $classes = [];

        if($emphasize) {
          $classes[] = 'eno-report-line-emphasized';
        } else if($mark) {
          $classes[] = 'eno-report-line-marked';
        }


        $snippet .= self::line(
          (string)($instruction->line + $context->indexing),
          substr($context->input, $instruction->index, $instruction->length),
          $classes
        );

        $in_omission = false;
      } else if(!$in_omission) {
        $snippet .= $omission;
        $in_omission = true;
      }
    }

    $snippet .= '</pre>';

    return $snippet;
  }
}
