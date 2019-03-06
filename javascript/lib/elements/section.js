const { errors } = require('../errors/validation.js');
const { Element } = require('./element.js');
const empty_module = require('./empty.js');
const field_module = require('./field.js');
const fieldset_module = require('./fieldset.js');
const list_module = require('./list.js');
const missing_field_module = require('./missing_field.js');
const missing_fieldset_module = require('./missing_fieldset.js');
const missing_list_module = require('./missing_list.js');
const missing_section_module = require('./missing_section.js');

const {
  COMMENT,
  ELEMENT,
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
    this._touched = true;

    let elements;
    if(key === null) {
      elements = this._lazyElements();
    } else {
      const elementsMap = this._lazyElements(true);
      elements = elementsMap.hasOwnProperty(key) ? elementsMap[key] : [];
    }

    if(elements.length === 0) {
      if(required || this._allElementsRequired) {
        throw errors.missingElement(this._context, key, this._instruction, 'missingElement');
      } else if(required === null) {
        return new missing_element_module.MissingElement(key, this);
      } else {
        return null;
      }
    }

    if(elements.length > 1)
      throw errors.unexpectedMultipleElements(this._context, key, elements, 'expectedSingleElement');

    const element = elements[0];

    switch(element.type) {
      case ELEMENT: return element.instance || new empty_module.Empty(this._context, element);
      case MULTILINE_FIELD_BEGIN: /* handled in FIELD below */
      case FIELD: return element.instance || new field_module.Field(this._context, element);
      case FIELDSET: return element.instance || new fieldset_module.Fieldset(this._context, element);
      case LIST: return element.instance || new list_module.List(this._context, element);
      case SECTION: return element.instance || new Section(this._context, element);
    }
  }

  _field(key, required = null) {
    this._touched = true;

    let elements;
    if(key === null) {
      elements = this._lazyElements();
    } else {
      const elementsMap = this._lazyElements(true);
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
      case ELEMENT: return new field_module.Field(this._context, element);
      case MULTILINE_FIELD_BEGIN: /* handled in FIELD below */
      case FIELD: return element.instance || new field_module.Field(this._context, element);
      default: throw errors.unexpectedElementType(this._context, key, element, 'expectedField');
    }
  }

  _fieldset(key, required = null) {
    this._touched = true;

    let elements;
    if(key === null) {
      elements = this._lazyElements();
    } else {
      const elementsMap = this._lazyElements(true);
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
      case ELEMENT: return new fieldset_module.Fieldset(this._context, element);
      case FIELDSET: return element.instance || new fieldset_module.Fieldset(this._context, element);
      default: throw errors.unexpectedElementType(this._context, key, element, 'expectedFieldset');
    }
  }

  _lazyElements(map = false) {
    if(this._instruction.hasOwnProperty('mirror')) {
      if(!this._instruction.mirror.hasOwnProperty('instance')) {
        new Section(this._context, this._instruction.mirror);
      }

      return this._instruction.mirror.instance._lazyElements(map);
    } else {
      if(!this.hasOwnProperty('_cachedElements')) { // TODO: Revisit the role of this in the new low level architecture
        this._cachedElementsMap = {};
        this._cachedElements = this._instruction.elements;

        for(const element of this._cachedElements) {
          if(this._cachedElementsMap.hasOwnProperty(element.key)) {
            this._cachedElementsMap[element.key].push(element);
          } else {
            this._cachedElementsMap[element.key] = [element];
          }
        }

        if(this._instruction.hasOwnProperty('extend')) {
          if(!this._instruction.extend.hasOwnProperty('instance')) {
            new Section(this._context, this._instruction.extend);
          }

          const copiedElements = this._instruction.extend.instance._lazyElements().filter(element =>
            !this._cachedElementsMap.hasOwnProperty(element.key)
          );

          this._cachedElements = copiedElements.concat(this._cachedElements);  // TODO: .push(...xy) somehow possible too? (but careful about order, which is relevant)

          for(const element of copiedElements) {
            if(this._cachedElementsMap.hasOwnProperty(element.key)) {
              this._cachedElementsMap[element.key].push(element);
            } else {
              this._cachedElementsMap[element.key] = [element];
            }
          }
        }
      }

      if(map) {
        return this._cachedElementsMap;
      } else {
        return this._cachedElements;
      }
    }
  }

  _instantiatedElements() {
    return this._lazyElements().map(element => {
      if(element.hasOwnProperty('instance'))
        return element.instance;

      switch(element.type) {
        case ELEMENT: return new empty_module.Empty(this._context, element);
        case MULTILINE_FIELD_BEGIN: /* handled in FIELD below */
        case FIELD: return new field_module.Field(this._context, element);
        case FIELDSET: return new fieldset_module.Fieldset(this._context, element);
        case LIST: return new list_module.List(this._context, element);
        case SECTION: return new Section(this._context, element);
      }
    });
  }

  _list(key, required = null) {
    this._touched = true;

    let elements;
    if(key === null) {
      elements = this._lazyElements();
    } else {
      const elementsMap = this._lazyElements(true);
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
      case ELEMENT: return new list_module.List(this._context, element);
      case LIST: return element.instance || new list_module.List(this._context, element);
      default: throw errors.unexpectedElementType(this._context, key, element, 'expectedList');
    }
  }

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
      elements = this._lazyElements();
    } else {
      const elementsMap = this._lazyElements(true);
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

  _untouched() {
    if(!this._touched)
      return this;

    for(const element of this._lazyElements()) {
      if(!element.instance) {
        switch(element.type) {
          case ELEMENT: return new empty_module.Empty(this._context, element);
          case MULTILINE_FIELD_BEGIN: /* handled in FIELD below */
          case FIELD: return new field_module.Field(this._context, element);
          case FIELDSET: return new fieldset_module.Fieldset(this._context, element);
          case LIST: return new list_module.List(this._context, element);
          case SECTION: return new Section(this._context, element);
        }
      }

      const untouched = element.instance._untouched();

      if(untouched)
        return untouched;
    }

    return false;
  }

  allElementsRequired(required = true) {
    this._allElementsRequired = required;

    for(const element of this._lazyElements()) {
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

    const elementsMap = this._lazyElements(true);

    for(const [key, elements] of Object.entries(elementsMap)) {
      if(options.hasOwnProperty('except') && options.except.includes(key)) continue;
      if(options.hasOwnProperty('only') && !options.only.includes(key)) continue;

      for(const element of elements) {
        let untouchedElement;

        if(element.hasOwnProperty('instance')) {
          untouchedElement = element.instance._untouched();
        } else {
          switch(element.type) {
            case ELEMENT: new empty_module.Empty(this._context, element);
            case MULTILINE_FIELD_BEGIN: /* handled in FIELD below */
            case FIELD: new field_module.Field(this._context, element);
            case FIELDSET: new fieldset_module.Fieldset(this._context, element);
            case LIST: new list_module.List(this._context, element);
            case SECTION: new Section(this._context, element);
          }

          untouchedElement = element.instance;
        }

        if(untouchedElement) {
          if(typeof message === 'function') {
            message = message(untouchedElement);
          }

          throw errors.unexpectedElement(this._context, message, untouchedElement._instruction);
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
      elements = this._lazyElements();
    } else {
      const elementsMap = this._lazyElements(true);
      elements = elementsMap.hasOwnProperty(key) ? elementsMap[key] : [];
    }

    return elements.map(element => {
      if(element.hasOwnProperty('instance'))
        return element.instance;

      switch(element.type) {
        case ELEMENT: return new empty_module.Empty(this._context, element);
        case MULTILINE_FIELD_BEGIN: /* handled in FIELD below */
        case FIELD: return new field_module.Field(this._context, element);
        case FIELDSET: return new fieldset_module.Fieldset(this._context, element);
        case LIST: return new list_module.List(this._context, element);
        case SECTION: return new Section(this._context, element);
      }
    });
  }

  field(key = null) {
    return this._field(key);
  }

  fields(key = null) {
    this._touched = true;

    let elements;
    if(key === null) {
      elements = this._lazyElements();
    } else {
      const elementsMap = this._lazyElements(true);
      elements = elementsMap.hasOwnProperty(key) ? elementsMap[key] : [];
    }

    return elements.map(element => {
      if(element.type === FIELD || element.type === MULTILINE_FIELD_BEGIN)
        return element.instance || new field_module.Field(this._context, element);

      if(element.type === ELEMENT)
        return new field_module.Field(this._context, element);

      throw errors.unexpectedElementType(this._context, key, element, 'expectedFields');
    });
  }

  fieldset(key = null) {
    return this._fieldset(key);
  }

  fieldsets(key = null) {
    this._touched = true;

    let elements;
    if(key === null) {
      elements = this._lazyElements();
    } else {
      const elementsMap = this._lazyElements(true);
      elements = elementsMap.hasOwnProperty(key) ? elementsMap[key] : [];
    }

    return elements.map(element => {
      if(element.type === FIELDSET)
        return element.instance || new fieldset_module.Fieldset(this._context, element);

      if(element.type === ELEMENT)
        return new fieldset_module.Fieldset(this._context, element);

      throw errors.unexpectedElementType(this._context, key, element, 'expectedFieldsets');
    });
  }

  key(loader) {
    this._touched = true;

    try {
      return loader(this._instruction.key);
    } catch(message) {
      throw errors.keyError(this._context, message, this._instruction);
    }
  }

  keyError(message) {
    return errors.keyError(
      this._context,
      typeof message === 'function' ? message(this._instruction.key) : message,
      this._instruction
    );
  }

  list(key = null) {
    return this._list(key);
  }

  lists(key = null) {
    this._touched = true;

    let elements;
    if(key === null) {
      elements = this._lazyElements();
    } else {
      const elementsMap = this._lazyElements(true);
      elements = elementsMap.hasOwnProperty(key) ? elementsMap[key] : [];
    }

    return elements.map(element => {
      if(element.type === LIST)
        return element.instance || new list_module.List(this._context, element);

      if(element.type === ELEMENT)
        return new list_module.List(this._context, element);

      throw errors.unexpectedElementType(this._context, key, element, 'expectedLists');
    });
  }

  optionalElement(key = null) {
    return this._element(key, false);
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
    if(!this._instruction.parent)
      return null;

    return this._instruction.parent.instance || new Section(this._context, this._instruction.parent);
  }

  // TODO: Revisit this not being deterministic - if you already queried empty elements as field/fieldset/list it yields different results than before that
  raw() {
    const elements = this._instantiatedElements().map(instance => instance.raw());

    if(this._instruction.hasOwnProperty('key'))
      return { [this._instruction.key]: elements };

    return elements;
  }

  requiredElement(key = null) {
    return this._element(key, true);
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
      elements = this._lazyElements();
    } else {
      const elementsMap = this._lazyElements(true);
      elements = elementsMap.hasOwnProperty(key) ? elementsMap[key] : [];
    }

    return elements.map(element => {
      if(element.type !== SECTION)
        throw errors.unexpectedElementType(this._context, key, element, 'expectedSections');

      return element.instance || new Section(this._context, element);
    });
  }

  stringKey() {
    this._touched = true;

    return this._instruction.key;
  }

  toString() {
    if(this._instruction.hasOwnProperty('key'))
      return `[object Section key=${this._instruction.key} elements=${this._lazyElements().length}]`;

    return `[object Section document elements=${this._lazyElements().length}]`;
  }

  touch() {
    this._touched = true;

    for(const instance of this._instantiatedElements()) {
      instance.touch();
    }
  }
}

exports.Section = Section;
