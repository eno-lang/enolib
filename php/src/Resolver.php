<?php declare(strict_types=1);

namespace Eno;
use \stdClass;
use Eno\Errors\Parsing;

class Resolver {
  function __construct(stdClass $context) {
    $this->context = $context;
  }

  private function consolidateNonSectionInstructions(stdClass $instruction, stdClass $template) : void {
    if(array_key_exists('comment_instructions', $template) &&
       !array_key_exists('comment_instructions', $instruction)) {
      $instruction->comment_instructions = $template->comment_instructions;
    }

    if($instruction->type === 'ELEMENT') {
      switch($template->type) {
        case 'MULTILINE_FIELD_BEGIN':
          $instruction->type = 'FIELD';
          $this->mirror($instruction, $template);
          break;
        case 'FIELD':
          $instruction->type = 'FIELD';
          $this->mirror($instruction, $template);
          break;
        case 'FIELDSET':
          $instruction->type = 'FIELDSET';
          $this->copyGeneric($instruction, $template);
          break;
        case 'LIST':
          $instruction->type = 'LIST';
          $this->copyGeneric($instruction, $template);
          break;
      }
    } else if($instruction->type === 'FIELDSET') {
      if($template->type === 'FIELDSET') {
        $this->mergeFieldsets($instruction, $template);
      } else if($template->type === 'FIELD' ||
                $template->type === 'LIST' ||
                $template->type === 'MULTILINE_FIELD_BEGIN') {
        $fieldset_entry_instruction = null;
        foreach($this->context->instructions as $candidate_instruction) {
          if($candidate_instruction->line > $instruction->line &&
             $candidate_instruction-> type === 'FIELDSET_ENTRY') {
            $fieldset_entry_instruction = $candidate_instruction;
            break;
          }
        }

        throw Parsing::missingFieldsetForFieldsetEntry($this->context, $fieldset_entry_instruction);
      }
    } else if($instruction->type === 'LIST') {
      if($template->type === 'LIST') {
        $this->copyGeneric($instruction, $template);
      } else if($template->type === 'FIELD' ||
                $template->type === 'FIELDSET' ||
                $template->type === 'MULTILINE_FIELD_BEGIN') {
        $list_item_instruction = null;
        foreach($this->context->instructions as $candidate_instruction) {
          if($candidate_instruction->line > $instruction->line &&
             $candidate_instruction-> type === 'LIST_ITEM') {
            $list_item_instruction = $candidate_instruction;
            break;
          }
        }

        throw Parsing::missingListForListItem($this->context, $list_item_instruction);
      }
    }

    $instruction->resolved = true;
  }

  private function consolidateSectionInstructions(stdClass $instruction, stdClass $template) : void {
    if(array_key_exists('comment_instructions', $template) &&
       !array_key_exists('comment_instructions', $instruction)) {
      $instruction->comment_instructions = $template->comment_instructions;
    }

    mergeSections($instruction, $template, $instruction->deep_copy);

    unset($instruction->deep_resolve);
    unset($instruction->resolve);
  }

  private function mirror(stdClass $instruction, stdClass $template) : void {
    if(array_key_exists('mirror', $template)) {
      $instruction->mirror = $template->mirror;
    } else {
      $instruction->mirror = $template;
    }
  }

  private function copyGeneric(stdClass $instruction, stdClass $template) : void {
    for(end($template->subinstructions); key($template->subinstructions) !== null; prev($template->subinstructions)) {
      $template_subinstruction = current($template->subinstructions);

      if($template_subinstruction->type === 'EMPTY_LINE' ||
         $template_subinstruction->type === 'COMMENT')
        continue;

      $cloned = clone $template_subinstruction;
      array_unshift($instruction->subinstructions, $cloned);
    }
  }

  private function mergeFieldsets(stdClass $instruction, stdClass $template) : void {
    $existing_entry_keys = [];
    foreach($instruction->subinstructions as $subinstruction) {
      if($subinstruction->type === 'FIELDSET_ENTRY') {
        $existing_entry_keys[] = $subinstruction->key;
      }
    }

    for(end($template->subinstructions); key($template->subinstructions) !== null; prev($template->subinstructions)) {
      $template_subinstruction = current($template->subinstructions);

      if($template_subinstruction->type !== 'FIELDSET_ENTRY')
        continue;

      if(!in_array($template_subinstruction->key, $existing_entry_keys)) {
        $cloned = clone $template_subinstruction;
        array_unshift($instruction->subinstructions, $cloned);
      }
    }
  }

  private function mergeSections(stdClass $instruction, stdClass $template, bool $deep_merge) : void {
    $existing_subinstructions_key_index = [];

    for(end($template->subinstructions); key($template->subinstructions) !== null; prev($template->subinstructions)) {
      $template_subinstruction = current($template->subinstructions);

      if($template_subinstruction->type === 'EMPTY_LINE' ||
         $template_subinstruction->type === 'COMMENT')
        continue;

      if(!array_key_exists($template_subinstruction->key, $existing_subinstructions_key_index)) {
        $existing_subinstructions_key_index[$template_subinstruction->key] =
          array_filter($instruction->subinstructions, function($instruction) use ($template_subinstruction) {
            return $instruction->key === $template_subinstruction->key;
          });
      }

      $existing_subinstructions = $existing_subinstructions_key_index[$template_subinstruction->key];

      if(count($existing_subinstructions) === 0) {
        $cloned = clone $template_subinstruction;
        array_unshift($instruction->subinstructions, $cloned);
        continue;
      }

      if(!$deep_merge || count($existing_subinstructions) > 1) {
        continue;
      }

      if($template_subinstruction->type === 'FIELDSET' &&
         $existing_subinstructions[0]->type === 'FIELDSET') {

        $template_subinstructions_with_same_key =
          array_filter($template->subinstructions, function($instruction) use($template_subinstruction) {
            return $instruction->key === $template_subinstruction->key;
          });

        if(count($template_subinstructions_with_same_key) === 1) {
          mergeFieldsets($existing_subinstructions[0], $template_subinstruction);
        }
      }

      if($template_subinstruction->type === 'SECTION' &&
         $existing_subinstructions[0]->type === 'SECTION') {

        $template_subinstructions_with_same_key =
          array_filter($template->subinstructions, function($instruction) use($template_subinstruction) {
            return $instruction->key === $template_subinstruction->key;
          });

        if(count($template_subinstructions_with_same_key) === 1) {
          mergeSections($existing_subinstructions[0], $template_subinstruction, true);
        }
      }
    }
  }

  private function resolveNonSectionElement(stdClass $instruction, array $previous_instructions = []) : void {
    if(in_array($instruction, $previous_instructions)) {
      throw Parsing::cyclicDependency($this->context, $instruction, $previous_instructions);
    }

    if(!array_key_exists($instruction->template, $this->context->non_section_template_index)) {
      throw Parsing::nonSectionElementNotFound($this->context, $instruction);
    }

    $templates = $this->context->non_section_template_index[$instruction->template];

    if(count($templates) > 1) {
      throw Parsing::multipleNonSectionElementTemplatesFound($this->context, $instruction, $templates);
    }

    $template = $templates[0];

    if(array_key_exists('template', $template) && !array_key_exists('resolved', $template)) {
      $this->resolveNonSectionElement($template, array_merge($previous_instructions, [$instruction]));
    }

    $this->consolidateNonSectionInstructions($instruction, $template);

    $index = array_search($instruction, $this->context->unresolved_non_section_instructions);
    unset($this->context->unresolved_non_section_instructions[$index]);
  }

  private function resolveSection(stdClass $instruction, array $previous_instructions = []) : void {
    if(in_array($instruction, $previous_instructions)) {
      throw Parsing::cyclicDependency($this->context, $instruction, $previous_instructions);
    }

    if(array_key_exists('deep_resolve', $instruction)) {
      foreach($instruction->subinstructions as $subinstruction) {
        if($subinstruction->type === 'SECTION' &&
           (array_key_exists('resolve', $subinstruction) ||
            array_key_exists('deep_resolve', $subinstruction))) {
          $this->resolveSection($subinstruction, array_merge($previous_instructions, [$instruction]));
        }
      }
    }

    if(!array_key_exists($instruction->template, $this->context->section_template_index)) {
      throw Parsing::sectionNotFound($this->context, $instruction);
    }

    $templates = $this->context->section_template_index[$instruction->template];

    if(count($templates) > 1) {
      throw Parsing::multipleSectionTemplatesFound($this->context, $instruction, $templates);
    }

    $template = $templates[0];

    if(array_key_exists('resolve', $template) || array_key_exists('deep_resolve', $template)) {
      $this->resolveSection($template, array_merge($previous_instructions, [$instruction]));
    }

    $this->consolidateSectionInstructions($instruction, $template);

    $index = array_search($instruction, $this->context->unresolved_section_instructions);
    unset($this->context->unresolved_section_instructions[$index]);
  }

  public function resolve() : void {
    while(count($this->context->unresolved_non_section_instructions) > 0) {
      $this->resolveNonSectionElement($this->context->unresolved_non_section_instructions[0]);
    }

    while(count($this->context->unresolved_section_instructions) > 0) {
      $this->resolveSection($this->context->unresolved_section_instructions[0]);
    }
  }
}
