const { errors } = require('./errors/parsing.js');
const {
  EMPTY_ELEMENT,
  FIELD,
  FIELDSET,
  LIST,
  MULTILINE_FIELD_BEGIN,
  SECTION
} = require('./constants.js');

const consolidateNonSectionElements = (context, element, template) => {
  if(template.hasOwnProperty('comments') && !element.hasOwnProperty('comments')) {
    element.comments = template.comments;
  }

  if(element.type === EMPTY_ELEMENT) {
    if(template.type === MULTILINE_FIELD_BEGIN) {
      element.type = FIELD;  // TODO: Revisit this - maybe should be MULTILINE_FIELD_COPY or something else - consider implications all around.
      mirror(element, template);
    } else if(template.type === FIELD) {
      element.type = FIELD;
      mirror(element, template);
    } else if(template.type === FIELDSET) {
      element.type = FIELDSET;
      mirror(element, template);
    } else if(template.type === LIST) {
      element.type = LIST;
      mirror(element, template);
    }
  } else if(element.type === FIELDSET) {
    if(template.type === FIELDSET) {
      element.extend = template;
    } else if(template.type === FIELD ||
              template.type === LIST ||
              template.type === MULTILINE_FIELD_BEGIN) {
      throw errors.missingFieldsetForFieldsetEntry(context, element.entries[0]);
    }
  } else if(element.type === LIST) {
    if(template.type === LIST) {
      element.extend = template;
    } else if(template.type === FIELD ||
              template.type === FIELDSET ||
              template.type === MULTILINE_FIELD_BEGIN) {
      throw errors.missingListForListItem(context, element.items[0]);
    }
  }
};

const consolidateSections = (context, section, template, deepMerge) => {
  if(template.hasOwnProperty('comments') && !section.hasOwnProperty('comments')) {
    section.comments = template.comments;
  }

  if(section.elements.length === 0) {
    mirror(section, template);
  } else {
    // TODO: Handle possibility of two templates (one hardcoded in the document, one implicitly derived through deep merging)
    //       Possibly also elswhere (e.g. up there in the mirror branch?)
    section.extend = template;

    if(!deepMerge) return;

    const mergeMap = {};

    for(const elementInstruction of section.elements) {
      if(elementInstruction.type !== SECTION || mergeMap.hasOwnProperty(elementInstruction.key)) {
        mergeMap[elementInstruction.key] = false; // non-mergable (no section or multiple sections with same key)
      } else {
        mergeMap[elementInstruction.key] = { section: elementInstruction };
      }
    }

    for(const elementInstruction of template.elements) {
      if(mergeMap.hasOwnProperty(elementInstruction.key)) {
        const merger = mergeMap[elementInstruction.key];

        if(merger === false) continue;

        if(elementInstruction.type !== SECTION || merger.hasOwnProperty('template')) {
          mergeMap[elementInstruction.key] = false; // non-mergable (no section or multiple template sections with same key)
        } else {
          merger.template = elementInstruction;
        }
      }
    }

    for(const merger of Object.values(mergeMap)) {
      if(merger === false) continue;
      // TODO: merger.template can be undefined if a section is applicable for
      //       merging but no matching merge template is present? (see python impl.)
      //       Note: No spec in js impl. reported this so far, unlike in python impl.
      consolidateSections(context, merger.section, merger.template, true);
    }
  }
};

const mirror = (element, template) => {
  if(template.hasOwnProperty('mirror')) {
    element.mirror = template.mirror;
  } else {
    element.mirror = template;
  }
}

const resolveNonSectionElement = (context, element, previousElements = []) => {
  if(previousElements.includes(element))
    throw errors.cyclicDependency(context, element, previousElements);

  const template = element.copy.template;

  if(template.hasOwnProperty('copy')) { // TODO: Maybe we change that to .unresolved everywhere ?
    resolveNonSectionElement(context, template, [...previousElements, element]);
  }

  consolidateNonSectionElements(context, element, template);

  delete element.copy;
};

const resolveSection = (context, section, previousSections = []) => {
  if(previousSections.includes(section))
    throw errors.cyclicDependency(context, section, previousSections);

  if(section.hasOwnProperty('deepResolve')) {
    for(const elementInstruction of section.elements) {
      if(elementInstruction.type === SECTION && (elementInstruction.hasOwnProperty('copy') || elementInstruction.hasOwnProperty('deepResolve'))) {
        resolveSection(context, elementInstruction, [...previousSections, section]);
      }
    }

    delete section.deepResolve;
  }

  if(section.hasOwnProperty('copy')) {
    const template = section.copy.template;

    if(template.hasOwnProperty('copy') || template.hasOwnProperty('deepResolve')) {
      resolveSection(context, template, [...previousSections, section]);
    }

    consolidateSections(context, section, template, section.deepCopy);

    delete section.copy;
  }
};

const index = (context, section, indexNonSectionElements, indexSections) => {
  for(const elementInstruction of section.elements) {
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

exports.resolve = function() {
  const unresolvedNonSectionElements = Object.values(this.copy.nonSectionElements);
  const unresolvedSections = Object.values(this.copy.sections);

  if(unresolvedNonSectionElements.length > 0 || unresolvedSections.length > 0) {
    index(this, this._document, unresolvedNonSectionElements.length > 0, unresolvedSections.length > 0);

    for(const copy of unresolvedNonSectionElements) {
      if(!copy.hasOwnProperty('template'))
        throw errors.nonSectionElementNotFound(this, copy.targets[0]);

      for(const target of copy.targets) {
        if(!target.hasOwnProperty('copy')) continue;

        resolveNonSectionElement(this, target);
      }
    }

    for(const copy of unresolvedSections) {
      if(!copy.hasOwnProperty('template'))
        throw errors.sectionNotFound(this, copy.targets[0]);

      for(const target of copy.targets) {
        if(!target.hasOwnProperty('copy')) continue;

        resolveSection(this, target);
      }
    }
  }

  delete this.copy;
};
