const element_module = require('./element.js');
const missing_empty_module = require('./missing/missing_empty.js');
const missing_field_module = require('./missing/missing_field.js');
const missing_fieldset_module = require('./missing/missing_fieldset.js');
const missing_list_module = require('./missing/missing_list.js');
const missing_section_element_module = require('./missing/missing_section_element.js');
const missing_section_module = require('./missing/missing_section.js');
const section_element_module = require('./section_element.js');

// TODO: touch() on ambiguous and/or missing elements
const { errors } = require('../errors/validation.js');
const { ElementBase } = require('./element_base.js');

const {
  DOCUMENT,
  EMPTY,
  FIELD,
  FIELDSET,
  FIELD_OR_FIELDSET_OR_LIST,
  LIST,
  MULTILINE_FIELD_BEGIN,
  SECTION
} = require('../constants.js');

// TODO: For each value store the representational type as well ? (e.g. string may come from "- foo" or -- foo\nxxx\n-- foo) and use that for precise error messages?

// TODO: These things ->   case MULTILINE_FIELD_BEGIN: /* handled in FIELD below */
//       Maybe handle with a generic FIELD type and an additional .multiline flag on the instruction? (less queries but quite some restructuring)

class Section extends ElementBase {
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
      if(required || required === null && this._allElementsRequired) {
        throw errors.missingElement(this._context, key, this._instruction, 'missingElement');
      } else if(required === null) {
        return new missing_section_element_module.MissingSectionElement(key, this);
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
      this._instantiateElements(this._instruction);
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
      if(required || required === null && this._allElementsRequired) {
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

    if(element._instruction.type !== EMPTY)
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
      if(required || required === null && this._allElementsRequired) {
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

    // TODO: Here and elsewhere these multiple checks are repeated in toField/to* again,
    //       should be optimized e.g. by going through a private toField cast mechanism
    //       without redundant checks. (or reconsidering the whole concept of storing
    //       SectionElement instances by default in sections)
    if(element._instruction.type !== FIELD &&
       element._instruction.type !== MULTILINE_FIELD_BEGIN &&
       element._instruction.type !== FIELD_OR_FIELDSET_OR_LIST)
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
      if(required || required === null && this._allElementsRequired) {
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

    if(element._instruction.type !== FIELDSET && element._instruction.type !== FIELD_OR_FIELDSET_OR_LIST)
      throw errors.unexpectedElementType(this._context, key, element._instruction, 'expectedFieldset');

    return element.toFieldset();
  }

  _instantiateElements(section) {
      this._instantiatedElements.push(
        ...section.elements.filter(element =>
          !this._instantiatedElementsMap.hasOwnProperty(element.key)
        ).map(element => {
          const instance = new section_element_module.SectionElement(this._context, element, this);

          if(this._instantiatedElementsMap.hasOwnProperty(element.key)) {
            this._instantiatedElementsMap[element.key].push(instance);
          } else {
            this._instantiatedElementsMap[element.key] = [instance];
          }

          return instance;
        })
      );
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
      if(required || required === null && this._allElementsRequired) {
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

    if(element._instruction.type !== LIST && element._instruction.type !== FIELD_OR_FIELDSET_OR_LIST)
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
      if(required || required === null && this._allElementsRequired) {
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
  /**
   * Assert that all elements inside this section/document have been touched
   * @param {string} message A static string error message or a message function taking the excess element and returning an error string
   * @param {object} options
   * @param {array} options.except An array of element keys to exclude from assertion
   * @param {array} options.only Specifies to ignore all elements but the ones includes in this array of element keys
   */
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
            // TODO: This doesn't make use of a possible cached Element, although, SectionElement would be unusable here anyway ...
            message = message(new element_module.Element(this._context, untouched, this));
          }

          throw errors.unexpectedElement(this._context, message, untouched);
        }
      }
    }
  }

  element(key = null) {
    return this._element(key);
  }

  /**
   * Returns the elements of this {@link Section} as an array in the original document order.
   *
   * @param {string} [key] If provided only elements with the specified key are returned.
   * @return {Element[]} The elements of this {@link Section}.
   */
  elements(key = null) {
    this._touched = true;

    if(key === null) {
      return this._elements();
    } else {
      const elementsMap = this._elements(true);
      return elementsMap.hasOwnProperty(key) ? elementsMap[key] : [];
    }
  }

  empty(key = null) {
    return this._empty(key);
  }

  // TODO: Here and in other implementations and in missing_section: empties(...) ?

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
         element._instruction.type !== FIELD_OR_FIELDSET_OR_LIST)
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
      if(element._instruction.type !== FIELDSET && element._instruction.type !== FIELD_OR_FIELDSET_OR_LIST)
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
      if(element._instruction.type !== LIST && element._instruction.type !== FIELD_OR_FIELDSET_OR_LIST)
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

  /**
   * Returns the parent {@link Section} or null when called on the document.
   *
   * @return {?Section} The parent instance or null.
   */
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

  /**
   * Returns a debug representation of this {@link Section} in the form of `[object Section key=foo elements=2]`, respectively `[object Section document elements=2]` for the document itself.
   *
   * @return {string} A debug representation of this {@link Section}.
   */
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
