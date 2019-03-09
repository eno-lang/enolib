const { errors } = require('../errors/validation.js');
const { Element } = require('./element.js');
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

// TODO: Use 'any' instead of anything in document-javascript branch? see: https://medium.com/@trukrs/type-safe-javascript-with-jsdoc-7a2a63209b76
//       Also consider keeping documentation on master / in release branch so users get intellisense and jsdoc typechecking through released package

// TODO: For each value store the representational type as well ? (e.g. string may come from "- foo" or -- foo\nxxx\n-- foo) and use that for precise error messages?

// TODO: These things ->   case MULTILINE_FIELD_BEGIN: /* handled in FIELD below */
//       Maybe handle with a generic FIELD type and an additional .multiline flag on the instruction? (less queries but quite some restructuring)

class Section extends Element {
  constructor(context, instruction) {
    super(context, instruction);

    this._instruction.instance = this;

    if(this._instruction.hasOwnProperty('parent') &&
       this._instruction.parent.hasOwnProperty('instance')) {
      this._allElementsRequired = this._instruction.parent.instance._allElementsRequired;
    } else {
      this._allElementsRequired = false;
    }
  }

  get [Symbol.toStringTag]() {
    return 'Section';
  }

  _element(key, required = null) {
    this._instruction.touched = true;

    let elements;
    if(key === null) {
      elements = this._context.elements(this._instruction);
    } else {
      const elementsMap = this._context.elements(this._instruction, true);
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
      throw errors.unexpectedMultipleElements(this._context, key, elements, 'expectedSingleElement');

    return new ambiguous_section_element_module.AmbiguousSectionElement(this._context, elements[0]);
  }

  _empty(key, required = null) {
    this._instruction.touched = true;

    let elements;
    if(key === null) {
      elements = this._context.elements(this._instruction);
    } else {
      const elementsMap = this._context.elements(this._instruction, true);
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
      throw errors.unexpectedMultipleElements(this._context, key, elements, 'expectedSingleEmpty');

    const element = elements[0];

    switch(element.type) {
      case EMPTY_ELEMENT: return new empty_module.Empty(this._context, element);
      default: throw errors.unexpectedElementType(this._context, key, element, 'expectedEmpty');
    }
  }

  _field(key, required = null) {
    this._instruction.touched = true;

    let elements;
    if(key === null) {
      elements = this._context.elements(this._instruction);
    } else {
      const elementsMap = this._context.elements(this._instruction, true);
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
      throw errors.unexpectedMultipleElements(this._context, key, elements, 'expectedSingleField');

    const element = elements[0];

    switch(element.type) {
      case EMPTY_ELEMENT: return new field_module.Field(this._context, element);
      case MULTILINE_FIELD_BEGIN: /* handled in FIELD below */
      case FIELD: return element.instance || new field_module.Field(this._context, element);
      default: throw errors.unexpectedElementType(this._context, key, element, 'expectedField');
    }
  }

  _fieldset(key, required = null) {
    this._instruction.touched = true;

    let elements;
    if(key === null) {
      elements = this._context.elements(this._instruction);
    } else {
      const elementsMap = this._context.elements(this._instruction, true);
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
      throw errors.unexpectedMultipleElements(this._context, key, elements, 'expectedSingleFieldset');

    const element = elements[0];

    switch(element.type) {
      case EMPTY_ELEMENT: return new fieldset_module.Fieldset(this._context, element);
      case FIELDSET: return element.instance || new fieldset_module.Fieldset(this._context, element);
      default: throw errors.unexpectedElementType(this._context, key, element, 'expectedFieldset');
    }
  }

  _list(key, required = null) {
    this._instruction.touched = true;

    let elements;
    if(key === null) {
      elements = this._context.elements(this._instruction);
    } else {
      const elementsMap = this._context.elements(this._instruction, true);
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
      throw errors.unexpectedMultipleElements(this._context, key, elements, 'expectedSingleList');

    const element = elements[0];

    switch(element.type) {
      case EMPTY_ELEMENT: return new list_module.List(this._context, element);
      case LIST: return element.instance || new list_module.List(this._context, element);
      default: throw errors.unexpectedElementType(this._context, key, element, 'expectedList');
    }
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
    this._instruction.touched = true;

    let elements;
    if(key === null) {
      elements = this._context.elements(this._instruction);
    } else {
      const elementsMap = this._context.elements(this._instruction, true);
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
      throw errors.unexpectedMultipleElements(this._context, key, elements, 'expectedSingleSection');

    const element = elements[0];

    if(element.type !== SECTION)
      throw errors.unexpectedElementType(this._context, key, element, 'expectedSection');

    return element.instance || new Section(this._context, element);
  }

  allElementsRequired(required = true) {
    this._allElementsRequired = required;

    for(const element of this._context.elements(this._instruction)) {
      if(!element.hasOwnProperty('instance'))
        continue;

      if(element.type === SECTION) {
        element.instance.allElementsRequired(required);
      } else if(element.type === FIELDSET) {
        element.instance.allEntriesRequired(required);
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

    const elementsMap = this._context.elements(this._instruction, true);

    for(const [key, elements] of Object.entries(elementsMap)) {
      if(options.hasOwnProperty('except') && options.except.includes(key)) continue;
      if(options.hasOwnProperty('only') && !options.only.includes(key)) continue;

      for(const element of elements) {
        const untouchedElement = this._context.untouched(element);

        if(untouchedElement) {
          if(typeof message === 'function') {
            switch(untouchedElement.type) {
              case EMPTY_ELEMENT: new empty_module.Empty(this._context, untouchedElement); // TODO: Empty! Revisit - Should this just also return AmbiguousAnyElement style thing? (then we can abolish empty some more)
              case MULTILINE_FIELD_BEGIN: /* handled in FIELD below */
              case FIELD: new field_module.Field(this._context, untouchedElement);
              case FIELDSET: new fieldset_module.Fieldset(this._context, untouchedElement);
              case LIST: new list_module.List(this._context, untouchedElement);
              case SECTION: new Section(this._context, untouchedElement);
            }

            message = message(untouchedElement.instance);
          }

          throw errors.unexpectedElement(this._context, message, untouchedElement);
        }
      }
    }
  }

  element(key = null) {
    return this._element(key);
  }

  elements(key = null) {
    this._instruction.touched = true;

    let elements;
    if(key === null) {
      elements = this._context.elements(this._instruction);
    } else {
      const elementsMap = this._context.elements(this._instruction, true);
      elements = elementsMap.hasOwnProperty(key) ? elementsMap[key] : [];
    }

    return elements.map(element => new ambiguous_section_element_module.AmbiguousSectionElement(this._context, element));
  }

  empty(key = null) {
    return this._empty(key);
  }

  field(key = null) {
    return this._field(key);
  }

  fields(key = null) {
    this._instruction.touched = true;

    let elements;
    if(key === null) {
      elements = this._context.elements(this._instruction);
    } else {
      const elementsMap = this._context.elements(this._instruction, true);
      elements = elementsMap.hasOwnProperty(key) ? elementsMap[key] : [];
    }

    return elements.map(element => {
      if(element.type === FIELD || element.type === MULTILINE_FIELD_BEGIN)
        return element.instance || new field_module.Field(this._context, element);

      if(element.type === EMPTY_ELEMENT)
        return new field_module.Field(this._context, element);

      throw errors.unexpectedElementType(this._context, key, element, 'expectedFields');
    });
  }

  fieldset(key = null) {
    return this._fieldset(key);
  }

  fieldsets(key = null) {
    this._instruction.touched = true;

    let elements;
    if(key === null) {
      elements = this._context.elements(this._instruction);
    } else {
      const elementsMap = this._context.elements(this._instruction, true);
      elements = elementsMap.hasOwnProperty(key) ? elementsMap[key] : [];
    }

    return elements.map(element => {
      if(element.type === FIELDSET)
        return element.instance || new fieldset_module.Fieldset(this._context, element);

      if(element.type === EMPTY_ELEMENT)
        return new fieldset_module.Fieldset(this._context, element);

      throw errors.unexpectedElementType(this._context, key, element, 'expectedFieldsets');
    });
  }

  list(key = null) {
    return this._list(key);
  }

  lists(key = null) {
    this._instruction.touched = true;

    let elements;
    if(key === null) {
      elements = this._context.elements(this._instruction);
    } else {
      const elementsMap = this._context.elements(this._instruction, true);
      elements = elementsMap.hasOwnProperty(key) ? elementsMap[key] : [];
    }

    return elements.map(element => {
      if(element.type === LIST)
        return element.instance || new list_module.List(this._context, element);

      if(element.type === EMPTY_ELEMENT)
        return new list_module.List(this._context, element);

      throw errors.unexpectedElementType(this._context, key, element, 'expectedLists');
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

    return this._instruction.parent.instance || new Section(this._context, this._instruction.parent);
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
    this._instruction.touched = true;

    let elements;
    if(key === null) {
      elements = this._context.elements(this._instruction);
    } else {
      const elementsMap = this._context.elements(this._instruction, true);
      elements = elementsMap.hasOwnProperty(key) ? elementsMap[key] : [];
    }

    return elements.map(element => {
      if(element.type !== SECTION)
        throw errors.unexpectedElementType(this._context, key, element, 'expectedSections');

      return element.instance || new Section(this._context, element);
    });
  }

  toString() {
    if(this._instruction.hasOwnProperty('key'))
      return `[object Section key=${this._instruction.key} elements=${this._context.elements(this._instruction).length}]`;

    return `[object Section document elements=${this._context.elements(this._instruction).length}]`;
  }
}

exports.Section = Section;
