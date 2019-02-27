const { errors } = require('./errors/parsing.js');
const {
  COMMENT,
  ELEMENT,
  FIELD,
  FIELDSET,
  FIELDSET_ENTRY,
  LIST,
  LIST_ITEM,
  MULTILINE_FIELD_BEGIN,
  SECTION
} = require('./constants.js');

const consolidateNonSectionElements = (context, instruction, template) => {
  if(template.hasOwnProperty('comments') && !instruction.hasOwnProperty('comments')) {
    instruction.comments = template.comments;
  }

  if(instruction.type === ELEMENT) {
    if(template.type === MULTILINE_FIELD_BEGIN) {
      instruction.type = FIELD;  // TODO: Revisit this - maybe should be MULTILINE_FIELD_COPY or something else - consider implications all around.
      mirror(instruction, template);
    } else if(template.type === FIELD) {
      instruction.type = FIELD;
      mirror(instruction, template);
    } else if(template.type === FIELDSET) {
      instruction.type = FIELDSET;
      mirror(instruction, template);
    } else if(template.type === LIST) {
      instruction.type = LIST;
      mirror(instruction, template);
    }
  } else if(instruction.type === FIELDSET) {
    if(template.type === FIELDSET) {
      instruction.extend = template;
    } else if(template.type === FIELD ||
              template.type === LIST ||
              template.type === MULTILINE_FIELD_BEGIN) {
      throw errors.missingFieldsetForFieldsetEntry(context, instruction.entries[0]);
    }
  } else if(instruction.type === LIST) {
    if(template.type === LIST) {
      instruction.extend = template;
    } else if(template.type === FIELD ||
              template.type === FIELDSET ||
              template.type === MULTILINE_FIELD_BEGIN) {
      throw errors.missingListForListItem(context, instruction.items[0]);
    }
  }
};

const consolidateSections = (context, instruction, template, deepMerge) => {
  if(template.hasOwnProperty('comments') && !instruction.hasOwnProperty('comments')) {
    instruction.comments = template.comments;
  }

  if(instruction.elements.length === 0) {
    mirror(instruction, template);
  } else {
    // TODO: Handle possibility of two templates (one hardcoded in the document, one implicitly derived through deep merging)
    //       Possibly also elswhere (e.g. up there in the mirror branch?)
    instruction.extend = template;

    if(!deepMerge) return;

    const mergeMap = {};

    for(const elementInstruction of instruction.elements) {
      if(elementInstruction.type !== SECTION || mergeMap.hasOwnProperty(elementInstruction.key)) {
        mergeMap[elementInstruction.key] = false; // non-mergable (no section or multiple instructions with same key)
      } else {
        mergeMap[elementInstruction.key] = { instruction: elementInstruction };
      }
    }

    for(const elementInstruction of template.elements) {
      if(mergeMap.hasOwnProperty(elementInstruction.key)) {
        const merger = mergeMap[elementInstruction.key];

        if(merger === false) continue;

        if(elementInstruction.type !== SECTION || merger.hasOwnProperty('template')) {
          mergeMap[elementInstruction.key] = false; // non-mergable (no section or multiple template instructions with same key)
        } else {
          merger.template = elementInstruction;
        }
      }
    }

    for(const [key, merger] of Object.entries(mergeMap)) {
      if(merger === false) continue;

      consolidateSections(context, merger.instruction, merger.template, true);
    }
  }
};

const mirror = (instruction, template) => {
  if(template.hasOwnProperty('mirror')) {
    instruction.mirror = template.mirror;
  } else {
    instruction.mirror = template;
  }
}

const resolveNonSectionElement = (context, instruction, previousInstructions = []) => {
  if(previousInstructions.includes(instruction))
    throw errors.cyclicDependency(context, instruction, previousInstructions);

  const template = instruction.copy.template;

  if(template.hasOwnProperty('copy')) { // TODO: Maybe we change that to .unresolved everywhere ?
    resolveNonSectionElement(context, template, [...previousInstructions, instruction]);
  }

  consolidateNonSectionElements(context, instruction, template);

  delete instruction.copy;
};

const resolveSection = (context, instruction, previousInstructions = []) => {
  if(previousInstructions.includes(instruction))
    throw errors.cyclicDependency(context, instruction, previousInstructions);

  if(instruction.hasOwnProperty('deepResolve')) {
    for(let elementInstruction of instruction.elements) {
      if(elementInstruction.type === SECTION && (elementInstruction.hasOwnProperty('copy') || elementInstruction.hasOwnProperty('deepResolve'))) {
        resolveSection(context, elementInstruction, [...previousInstructions, instruction]);
      }
    }

    delete instruction.deepResolve;
  }

  if(instruction.hasOwnProperty('copy')) {
    const template = instruction.copy.template;

    if(template.hasOwnProperty('copy') || template.hasOwnProperty('deepResolve')) {
      resolveSection(context, template, [...previousInstructions, instruction]);
    }

    consolidateSections(context, instruction, template, instruction.deepCopy);

    delete instruction.copy;
  }
};

const index = (context, section, indexNonSectionElements, indexSections) => {
  for(let elementInstruction of section.elements) {
    if(elementInstruction.type === SECTION) {
      index(context, elementInstruction, indexNonSectionElements, indexSections);

      if(indexSections &&
         context.copy.sections.hasOwnProperty(elementInstruction.key) &&
         elementInstruction.key !== elementInstruction.template) {
        const copyData = context.copy.sections[elementInstruction.key];

        if(copyData.hasOwnProperty('template'))
          throw errors.twoOrMoreTemplatesFound(context, copyData.targets[0], copyData.template, elementInstruction);

        copyData.template = elementInstruction;
      }
    } else if(indexNonSectionElements &&
              context.copy.nonSectionElements.hasOwnProperty(elementInstruction.key) &&
              elementInstruction.key !== elementInstruction.template) {
      const copyData = context.copy.nonSectionElements[elementInstruction.key];

      if(copyData.hasOwnProperty('template'))
        throw errors.twoOrMoreTemplatesFound(context, copyData.targets[0], copyData.template, elementInstruction);

      copyData.template = elementInstruction;
    }
  }
}

exports.resolve = context => {
  const unresolvedNonSectionElements = Object.entries(context.copy.nonSectionElements);
  const unresolvedSections = Object.entries(context.copy.sections);

  if(unresolvedNonSectionElements.length > 0 || unresolvedSections.length > 0) {
    index(context, context.document, unresolvedNonSectionElements.length > 0, unresolvedSections.length > 0);

    for(const [key, copy] of unresolvedNonSectionElements) {
      if(!copy.hasOwnProperty('template'))
        throw errors.nonSectionElementNotFound(context, copy.targets[0]);

      for(const target of copy.targets) {
        if(!target.hasOwnProperty('copy')) continue;

        resolveNonSectionElement(context, target);
      }
    }

    for(const [key, copy] of unresolvedSections) {
      if(!copy.hasOwnProperty('template'))
        throw errors.sectionNotFound(context, copy.targets[0]);

      for(const target of copy.targets) {
        if(!target.hasOwnProperty('copy')) continue;

        resolveSection(context, target);
      }
    }
  }

  delete context.copy;
};
