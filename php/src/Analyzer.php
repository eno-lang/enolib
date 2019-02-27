<?php declare(strict_types=1);

namespace Eno;
use \stdClass;
use Eno\Errors\Parsing;

class Analyzer {
  function __construct(stdClass $context) {
    $this->context = $context;

    $this->context->document_instruction = (object) [
      'depth' => 0,
      'index' => 0,
      'length' => 0,
      'line' => 0,
      'ranges' => [
        'section_operator' => [0, 0],
        'key' => [0, 0]
      ],
      'subinstructions' => []
    ];

    $this->context->non_section_template_index = [];
    $this->context->section_template_index = [];
    $this->context->unresolved_non_section_instructions = [];
    $this->context->unresolved_section_instructions = [];

    $this->active_section_instructions = [$this->context->document_instruction];
    $this->last_continuable_instruction = null;
    $this->last_element_instruction = null;
    $this->last_section_instruction = $this->context->document_instruction;
    $this->last_unassigned_comment_instruction_index = null;
    $this->last_unassigned_idle_instruction_index = null;
  }

  public function analyze() : void {
    foreach($this->context->instructions as $index => $instruction) {

      if($instruction->type === 'EMPTY_LINE') {
        $this->last_unassigned_comment_instruction_index = null;

        if($this->last_unassigned_idle_instruction_index === null && $this->last_element_instruction) {
          $this->last_unassigned_idle_instruction_index = $index;
        } else {
          $this->last_section_instruction->subinstructions[] = $instruction;
        }

        continue;
      }

      // TODO: Appending multiline_field content instructions to the multiline_field as subinstructions
      //       is probably not necessary anymore in the new architecture, this could
      //       save performance if we can omit it, investigate and follow up.
      if($instruction->type === 'MULTILINE_FIELD_VALUE') {
        $this->last_element_instruction->subinstructions[] = $instruction;
        continue;
      }

      if($instruction->type === 'FIELD') {
        $this->assignInstructions($index, $instruction, $this->last_section_instruction);

        $instruction->subinstructions = [];

        $this->last_continuable_instruction = $instruction;
        $this->last_element_instruction = $instruction;

        if(array_key_exists($instruction->key, $this->context->non_section_template_index)) {
          $this->context->non_section_template_index[$instruction->key][] = $instruction;
        } else {
          $this->context->non_section_template_index[$instruction->key] = [$instruction];
        }

        $this->last_section_instruction->subinstructions[] = $instruction;

        continue;
      }

      if($instruction->type === 'ELEMENT') {
        $this->assignInstructions($index, $instruction, $this->last_section_instruction);

        $instruction->subinstructions = [];


        $this->last_element_instruction = $instruction;

        if(array_key_exists('template', $instruction)) {
          $this->context->unresolved_non_section_instructions[] = $instruction;
          $this->last_continuable_instruction = null;
        } else {
          $this->last_continuable_instruction = $instruction;
        }

        if(!array_key_exists('template', $instruction) || $instruction->key !== $instruction->template) {
          if(array_key_exists($instruction->key, $this->context->non_section_template_index)) {
            $this->context->non_section_template_index[$instruction->key][] = $instruction;
          } else {
            $this->context->non_section_template_index[$instruction->key] = [$instruction];
          }
        }

        $this->last_section_instruction->subinstructions[] = $instruction;

        continue;
      }

      if($instruction->type === 'LIST_ITEM') {
        if($this->last_element_instruction === null) {
          throw Parsing::missingListForListItem($this->context, $instruction);
        }

        $this->assignInstructions($index, $instruction, $this->last_element_instruction);

        $instruction->key = $this->last_element_instruction->key;
        $instruction->subinstructions = [];

        if($this->last_element_instruction->type === 'LIST') {
          $this->last_element_instruction->subinstructions[] = $instruction;
          $this->last_continuable_instruction = $instruction;
          continue;
        }

        if($this->last_element_instruction->type === 'ELEMENT') {
          $this->last_element_instruction->type = 'LIST';
          $this->last_element_instruction->subinstructions[] = $instruction;
          $this->last_continuable_instruction = $instruction;
          continue;
        }

        throw Parsing::missingListForListItem($this->context, $instruction);
      }

      if($instruction->type === 'FIELDSET_ENTRY') {
        if($this->last_element_instruction === null) {
          throw Parsing::missingFieldsetForFieldsetEntry($this->context, $instruction);
        }

        $this->assignInstructions($index, $instruction, $this->last_element_instruction);

        $instruction->subinstructions = [];

        if($this->last_element_instruction->type === 'FIELDSET') {
          $this->last_element_instruction->subinstructions[] = $instruction;
          $this->last_continuable_instruction = $instruction;
          continue;
        }

        if($this->last_element_instruction->type === 'ELEMENT') {
          $this->last_element_instruction->type = 'FIELDSET';
          $this->last_element_instruction->subinstructions[] = $instruction;
          $this->last_continuable_instruction = $instruction;
          continue;
        }

        throw Parsing::missingFieldsetForFieldsetEntry($this->context, $instruction);
      }

      if($instruction->type ===  'MULTILINE_FIELD_BEGIN') {
        $this->assignInstructions($index, $instruction, $this->last_section_instruction);

        $instruction->subinstructions = [];

        $this->last_continuable_instruction = null;
        $this->last_element_instruction = $instruction;

        if(array_key_exists($instruction->key, $this->context->non_section_template_index)) {
          $this->context->non_section_template_index[$instruction->key][] = $instruction;
        } else {
          $this->context->non_section_template_index[$instruction->key] = [$instruction];
        }

        $this->last_section_instruction->subinstructions[] = $instruction;

        continue;
      }

      if($instruction->type === 'MULTILINE_FIELD_END') {
        $this->last_element_instruction->subinstructions[] = $instruction;
        $this->last_element_instruction = null;
        continue;
      }

      if($instruction->type === 'CONTINUATION') {
        if($this->last_continuable_instruction === null) {
          if($this->last_element_instruction && array_key_exists('template', $this->last_element_instruction)){
            throw Parsing::lineContinuationOnCopiedElement($this->context, $instruction, $this->last_element_instruction);
          } else {
            throw Parsing::missingElementForContinuation($this->context, $instruction);
          }
        }

        $this->last_unassigned_comment_instruction_index = null;
        $this->assignInstructions($index, $instruction, $this->last_element_instruction);

        if($this->last_element_instruction->type === 'ELEMENT') {
          $this->last_element_instruction->type = 'FIELD';
          $this->last_element_instruction->value = null;
        }

        $this->last_continuable_instruction->subinstructions[] = $instruction;
        continue;
      }

      if($instruction->type === 'SECTION') {
        $this->assignInstructions($index, $instruction, $this->last_section_instruction);

        if($instruction->depth - $this->last_section_instruction->depth > 1) {
          throw Parsing::sectionHierarchyLayerSkip($this->context, $instruction, $this->last_section_instruction);
        }

        if($instruction->depth > $this->last_section_instruction->depth) {
          $this->last_section_instruction->subinstructions[] = $instruction;
        } else {
          while($this->active_section_instructions[count($this->active_section_instructions) - 1]->depth >= $instruction->depth) {
            array_pop($this->active_section_instructions);
          }

          $this->active_section_instructions[count($this->active_section_instructions) - 1]->subinstructions[] = $instruction;
        }

        $this->last_continuable_instruction = null;
        $this->last_element_instruction = null;
        $this->last_section_instruction = $instruction;
        $this->active_section_instructions[] = $instruction;

        if(array_key_exists('template', $instruction)) {
          $this->context->unresolved_section_instructions[] = $instruction;

          $instruction->resolve = true;
          for($section_index = 1; $section_index < count($this->active_section_instructions); $section_index++) {
            $this->active_section_instructions[$section_index]->deep_resolve = true;
          }
        }

        if(!array_key_exists('template', $instruction) || $instruction->key !== $instruction->template) {
          if(array_key_exists($instruction->key, $this->context->section_template_index)) {
            $this->context->section_template_index[$instruction->key][] = $instruction;
          } else {
            $this->context->section_template_index[$instruction->key] = [$instruction];
          }
        }

        $instruction->subinstructions = [];

        continue;
      }

      if($instruction->type === 'COMMENT') {
        if($this->last_unassigned_comment_instruction_index === null) {
          $this->last_unassigned_comment_instruction_index = $index;
        }

        if($this->last_unassigned_idle_instruction_index === null && $this->last_element_instruction) {
          $this->last_unassigned_idle_instruction_index = $index;
        } else {
          $this->last_section_instruction->subinstructions[] = $instruction;
        }

        continue;
      }

    } // ends foreach($this->context->instructions as $instruction)

    if($this->last_unassigned_idle_instruction_index !== null) {
      $this->last_section_instruction->subinstructions = array_merge(
        $this->last_section_instruction->subinstructions,
        array_slice($this->context->instructions, $this->last_unassigned_idle_instruction_index)
      );
    }
  }

  private function assignInstructions(int $index, stdClass $instruction_receiving_comment_instructions, stdClass $instruction_receiving_idle_instructions) {
    if($this->last_unassigned_idle_instruction_index !== null) {
      array_push(
        $instruction_receiving_idle_instructions->subinstructions,
        ...array_slice( // TODO: Maybe will need to use array_merge instead if splat does not work
          $this->context->instructions,
          $this->last_unassigned_idle_instruction_index,
          $index - $this->last_unassigned_idle_instruction_index
        )
      );
      $this->last_unassigned_idle_instruction_index = null;
    }

    if($this->last_unassigned_comment_instruction_index !== null) {
      $instruction_receiving_comment_instructions->comment_instructions = array_slice(
        $this->context->instructions,
        $this->last_unassigned_comment_instruction_index,
        $index - $this->last_unassigned_comment_instruction_index
      );
      $this->last_unassigned_comment_instruction_index = null;
    }
  }
}
