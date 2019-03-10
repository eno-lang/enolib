const { errors } = require('../errors/validation.js');
const { Element } = require('./element.js');
const ambiguous_element_module = require('./ambiguous_element.js');
const ambiguous_section_element_module = require('./ambiguous_section_element.js');
const empty_module = require('./empty.js');
const field_module = require('./field.js');
const fieldset_module = require('./fieldset.js');
const list_module = require('./list.js');
const missing_ambiguous_section_element_module = require('./missing_ambiguous_section_element.js');
const missing_field_module = require('./missing_field.js');
const missing_fieldset_module = require('./missing_fieldset.js');
const missing_list_module = require('./missing_list.js');
const missing_section_module = require('./missing_section.js');

// TODO: touch() on ambiguous and/or missing elements

const {
  DOCUMENT,
  EMPTY_ELEMENT,
  FIELD,
  FIELDSET,
  LIST,
  MULTILINE_FIELD_BEGIN,
  SECTION
} = require('../constants.js');

// TODO: Consider keeping documentation on master / in release branch so users get intellisense and jsdoc typechecking through released package

// TODO: For each value store the representational type as well ? (e.g. string may come from "- foo" or -- foo\nxxx\n-- foo) and use that for precise error messages?

// TODO: These things ->   case MULTILINE_FIELD_BEGIN: /* handled in FIELD below */
//       Maybe handle with a generic FIELD type and an additional .multiline flag on the instruction? (less queries but quite some restructuring)

class Section extends Element {
  constructor(context, instruction, parent = null) {
    super(context, instruction, parent);

    this._allElementsRequired = parent ? parent._allElementsRequired : false;
  }

  get [Symbol.toStringTag]() {
    return 'Section';
  }

  _element(key, required = null) {
    this._touched = true;

    let elements;
    if(key === null) {
      elements = this._elements();
    } else {
      const elementsMap = this._elements(true);
      elements = elementsMap.hasOwnProperty(key) ? elementsMap[key] : [];
    }

    if(elements.length === 0) {
      if(required || this._allElementsRequired) {
        throw errors.missingElement(this._context, key, this._instruction, 'missingElement');
      } else if(required === null) {
        return new missing_ambiguous_section_element_module.MissingAmbiguousSectionElement(key, this);
      } else {
        return null;
      }
    }

    if(elements.length > 1)
      throw errors.unexpectedMultipleElements(
        this._context,
        key,
        elements.map(element => element._instruction),
        'expectedSingleElement'
      );

    return elements[0];
  }

  _elements(map = false) {
    if(!this.hasOwnProperty('_instantiatedElements')) {
      this._instantiatedElements = [];
      this._instantiatedElementsMap = {};
      this._instantiateElements(this._instruction, this._instantiatedElements, this._instantiatedElementsMap);
    }

    return map ? this._instantiatedElementsMap : this._instantiatedElements;
  }

  _empty(key, required = null) {
    this._touched = true;

    let elements;
    if(key === null) {
      elements = this._elements();
    } else {
      const elementsMap = this._elements(true);
      elements = elementsMap.hasOwnProperty(key) ? elementsMap[key] : [];
    }

    if(elements.length === 0) {
      if(required || this._allElementsRequired) {
        throw errors.missingElement(this._context, key, this._instruction, 'missingEmpty');
      } else if(required === null) {
        return new missing_empty_module.MissingEmpty(key, this);
      } else {
        return null;
      }
    }

    if(elements.length > 1)
      throw errors.unexpectedMultipleElements(
        this._context,
        key,
        elements.map(element => element._instruction),
        'expectedSingleEmpty'
      );

    const element = elements[0];

    if(element._instruction.type !== EMPTY_ELEMENT)
      throw errors.unexpectedElementType(this._context, key, element._instruction, 'expectedEmpty');

    return element.toEmpty();
  }

  _field(key, required = null) {
    this._touched = true;

    let elements;
    if(key === null) {
      elements = this._elements();
    } else {
      const elementsMap = this._elements(true);
      elements = elementsMap.hasOwnProperty(key) ? elementsMap[key] : [];
    }

    if(elements.length === 0) {
      if(required || this._allElementsRequired) {
        throw errors.missingElement(this._context, key, this._instruction, 'missingField');
      } else if(required === null) {
        return new missing_field_module.MissingField(key, this);
      } else {
        return null;
      }
    }

    if(elements.length > 1)
      throw errors.unexpectedMultipleElements(
        this._context,
        key,
        elements.map(element => element._instruction),
        'expectedSingleField'
      );

    const element = elements[0];

    if(element._instruction.type !== FIELD &&
       element._instruction.type !== MULTILINE_FIELD_BEGIN &&
       element._instruction.type !== EMPTY_ELEMENT)
      throw errors.unexpectedElementType(this._context, key, element._instruction, 'expectedField');

    return element.toField();
  }

  _fieldset(key, required = null) {
    this._touched = true;

    let elements;
    if(key === null) {
      elements = this._elements();
    } else {
      const elementsMap = this._elements(true);
      elements = elementsMap.hasOwnProperty(key) ? elementsMap[key] : [];
    }

    if(elements.length === 0) {
      if(required || this._allElementsRequired) {
        throw errors.missingElement(this._context, key, this._instruction, 'missingFieldset');
      } else if(required === null) {
        return new missing_fieldset_module.MissingFieldset(key, this);
      } else {
        return null;
      }
    }

    if(elements.length > 1)
      throw errors.unexpectedMultipleElements(
        this._context,
        key,
        elements.map(element => element._instruction),
        'expectedSingleFieldset'
      );

    const element = elements[0];

    if(element._instruction.type !== FIELDSET && element._instruction.type !== EMPTY_ELEMENT)
      throw errors.unexpectedElementType(this._context, key, element._instruction, 'expectedFieldset');

    return element.toFieldset();
  }

  _instantiateElements(section, elements = [], elementsMap = {}) {
    if(section.hasOwnProperty('mirror')) {
      this._instantiateElements(section.mirror, elements, elementsMap);
    } else {
      elements.push(
        ...section.elements.filter(element =>
          !elementsMap.hasOwnProperty(element.key)
        ).map(element => {
          const instance = new ambiguous_section_element_module.AmbiguousSectionElement(this._context, element, this);

          if(elementsMap.hasOwnProperty(element.key)) {
            elementsMap[element.key].push(instance);
          } else {
            elementsMap[element.key] = [instance];
          }

          return instance;
        })
      );

      if(section.hasOwnProperty('extend')) {
        this._instantiateElements(section.extend, elements, elementsMap);
      }
    }

    return [elements, elementsMap];
  }

  _list(key, required = null) {
    this._touched = true;

    let elements;
    if(key === null) {
      elements = this._elements();
    } else {
      const elementsMap = this._elements(true);
      elements = elementsMap.hasOwnProperty(key) ? elementsMap[key] : [];
    }

    if(elements.length === 0) {
      if(required || this._allElementsRequired) {
        throw errors.missingElement(this._context, key, this._instruction, 'missingList');
      } else if(required === null) {
        return new missing_list_module.MissingList(key, this);
      } else {
        return null;
      }
    }

    if(elements.length > 1)
      throw errors.unexpectedMultipleElements(
        this._context,
        key,
        elements.map(element => element._instruction),
        'expectedSingleList'
      );

    const element = elements[0];

    if(element._instruction.type !== LIST && element._instruction.type !== EMPTY_ELEMENT)
      throw errors.unexpectedElementType(this._context, key, element._instruction, 'expectedList');

    return element.toList();
  }

  // TODO: Can probably be simplified again - e.g. pushed back into Missing* classes themselves - also check if MissingFieldsetEntry addition is made use of already
  _missingError(element) {
    if(element instanceof missing_field_module.MissingField) {
      throw errors.missingElement(this._context, element._key, this._instruction, 'missingField');
    } else if(element instanceof missing_fieldset_module.MissingFieldset) {
      throw errors.missingElement(this._context, element._key, this._instruction, 'missingFieldset');
    } else if(element instanceof missing_list_module.MissingList) {
      throw errors.missingElement(this._context, element._key, this._instruction, 'missingList');
    } else if(element instanceof missing_section_module.MissingSection) {
      throw errors.missingElement(this._context, element._key, this._instruction, 'missingSection');
    } else {
      throw errors.missingElement(this._context, element._key, this._instruction, 'missingElement');
    }
  }

  _section(key, required = null) {
    this._touched = true;

    let elements;
    if(key === null) {
      elements = this._elements();
    } else {
      const elementsMap = this._elements(true);
      elements = elementsMap.hasOwnProperty(key) ? elementsMap[key] : [];
    }

    if(elements.length === 0) {
      if(required || this._allElementsRequired) {
        throw errors.missingElement(this._context, key, this._instruction, 'missingSection');
      } else if(required === null) {
        return new missing_section_module.MissingSection(key, this);
      } else {
        return null;
      }
    }

    if(elements.length > 1)
      throw errors.unexpectedMultipleElements(
        this._context,
        key,
        elements.map(element => element._instruction),
        'expectedSingleSection'
      );

    const element = elements[0];

    if(element._instruction.type !== SECTION)
      throw errors.unexpectedElementType(this._context, key, element._instruction, 'expectedSection');

    return element.toSection();
  }

  _untouched() {
    if(!this._touched)
      return this._instruction;

    for(const element of this._elements()) {
      const untouchedElement = element._untouched();

      if(untouchedElement) return untouchedElement;
    }

    return false;
  }

  allElementsRequired(required = true) {
    this._allElementsRequired = required;

    for(const element of this._elements()) {
      if(element._instruction.type === SECTION && element._yielded) {
        element.toSection().allElementsRequired(required);
      } else if(element._instruction.type === FIELDSET && element._yielded) {
        element.toFieldset().allEntriesRequired(required);
      }
    }
  }

  // TODO: Revisit this method name (ensureAllTouched? ... etc.)
  assertAllTouched(...optional) {
    let message = null;
    let options = {};

    for(const argument of optional) {
      if(typeof argument === 'object') {
        options = argument;
      } else {
        message = argument
      }
    }

    const elementsMap = this._elements(true);

    for(const [key, elements] of Object.entries(elementsMap)) {
      if(options.hasOwnProperty('except') && options.except.includes(key)) continue;
      if(options.hasOwnProperty('only') && !options.only.includes(key)) continue;

      for(const element of elements) {
        const untouched = element._untouched();

        if(untouched) {
          if(typeof message === 'function') {
            // TODO: This doesn't make use of a possible cached AmbiguousElement, although, AmbiguousSectionElement would be unusable here anyway ...
            message = message(new ambiguous_element_module.AmbiguousElement(this._context, untouched, this));
          }

          throw errors.unexpectedElement(this._context, message, untouched);
        }
      }
    }
  }

  element(key = null) {
    return this._element(key);
  }

  elements(key = null) {
    this._touched = true;

    let elements;
    if(key === null) {
      elements = this._elements();
    } else {
      const elementsMap = this._elements(true);
      elements = elementsMap.hasOwnProperty(key) ? elementsMap[key] : [];
    }

    return elements;
  }

  empty(key = null) {
    return this._empty(key);
  }

  field(key = null) {
    return this._field(key);
  }

  fields(key = null) {
    this._touched = true;

    let elements;
    if(key === null) {
      elements = this._elements();
    } else {
      const elementsMap = this._elements(true);
      elements = elementsMap.hasOwnProperty(key) ? elementsMap[key] : [];
    }

    return elements.map(element => {
      if(element._instruction.type !== FIELD &&
         element._instruction.type !== MULTILINE_FIELD_BEGIN &&
         element._instruction.type !== EMPTY_ELEMENT)
        throw errors.unexpectedElementType(this._context, key, element._instruction, 'expectedFields');

      return element.toField();
    });
  }

  fieldset(key = null) {
    return this._fieldset(key);
  }

  fieldsets(key = null) {
    this._touched = true;

    let elements;
    if(key === null) {
      elements = this._elements();
    } else {
      const elementsMap = this._elements(true);
      elements = elementsMap.hasOwnProperty(key) ? elementsMap[key] : [];
    }

    return elements.map(element => {
      if(element._instruction.type !== FIELDSET && element._instruction.type !== EMPTY_ELEMENT)
        throw errors.unexpectedElementType(this._context, key, element._instruction, 'expectedFieldsets');

      return element.toFieldset();
    });
  }

  list(key = null) {
    return this._list(key);
  }

  lists(key = null) {
    this._touched = true;

    let elements;
    if(key === null) {
      elements = this._elements();
    } else {
      const elementsMap = this._elements(true);
      elements = elementsMap.hasOwnProperty(key) ? elementsMap[key] : [];
    }

    return elements.map(element => {
      if(element._instruction.type !== LIST && element._instruction.type !== EMPTY_ELEMENT)
        throw errors.unexpectedElementType(this._context, key, element._instruction, 'expectedLists');

      return element.toList();
    });
  }

  optionalElement(key = null) {
    return this._element(key, false);
  }

  optionalEmpty(key = null) {
    return this._empty(key, false);
  }

  optionalField(key = null) {
    return this._field(key, false);
  }

  optionalFieldset(key = null) {
    return this._fieldset(key, false);
  }

  optionalList(key = null) {
    return this._list(key, false);
  }

  optionalSection(key = null) {
    return this._section(key, false);
  }

  parent() {
    if(this._instruction.type === DOCUMENT)
      return null;

    return this._parent || new Section(this._context, this._instruction.parent);
  }

  requiredElement(key = null) {
    return this._element(key, true);
  }

  requiredEmpty(key = null) {
    return this._empty(key, true);
  }

  requiredField(key = null) {
    return this._field(key, true);
  }

  requiredFieldset(key = null) {
    return this._fieldset(key, true);
  }

  requiredList(key = null) {
    return this._list(key, true);
  }

  requiredSection(key = null) {
    return this._section(key, true);
  }

  section(key = null) {
    return this._section(key);
  }

  sections(key = null) {
    this._touched = true;

    let elements;
    if(key === null) {
      elements = this._elements();
    } else {
      const elementsMap = this._elements(true);
      elements = elementsMap.hasOwnProperty(key) ? elementsMap[key] : [];
    }

    return elements.map(element => {
      if(element._instruction.type !== SECTION)
        throw errors.unexpectedElementType(this._context, key, element._instruction, 'expectedSections');

      return element.toSection();
    });
  }

  toString() {
    if(this._instruction.type === DOCUMENT)
      return `[object Section document elements=${this._elements().length}]`;

    return `[object Section key=${this._instruction.key} elements=${this._elements().length}]`;
  }

  touch() {
    // TODO: Potentially revisit this - maybe we can do a shallow touch, that is: propagating only to the hierarchy below that was already instantiated,
    //       while marking the deepest initialized element as _touchedRecursive/Deeply or something, which marks a border for _untouched() checks that
    //       does not have to be traversed deeper down. However if after that the hierarchy is used after all, the _touched property should be picked
    //       up starting at the element marked _touchedRecursive, passing the property down below.

    this._touched = true;

    for(const element of this._elements()) {
      element.touch();
    }
  }
}

exports.Section = Section;
