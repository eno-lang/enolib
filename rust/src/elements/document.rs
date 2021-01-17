use std::collections::HashMap;

use crate::context::Context;
use crate::error::Error;
use crate::errors::validation;
use crate::instruction::SectionInstruction;
use super::element::Element;
use super::section::Parent;
use super::section::Section;

const DOCUMENT_NAME: &str = "<>#:=|\\_ENO_DOCUMENT";

pub struct Document<'a> {
    context: Context<'a>,
    elements: Vec<Element<'a>>,
    elements_associative: HashMap<&'a str, Vec<&'a Element<'a>>>,
    instruction: SectionInstruction,
    touched: bool
}

impl<'a> Document<'a> {
    pub fn name(&self) -> &str {
        &self.instruction.name
    }

    pub fn context(&self) -> &Context<'a> {
        &self.context
    }

    pub fn add(&mut self, element: Element<'a>) {
        self.elements.push(element);
        // self.elements.push(element); TODO: elements_associative
    }

    pub fn new(context: Context<'a>) -> Document<'a> {
        let mut document_instruction = SectionInstruction::new(0, 0, 0);

        document_instruction.name =  String::from(DOCUMENT_NAME);

        let mut document = Document {
            context,
            elements: Vec::new(),
            elements_associative: HashMap::new(),
            instruction: document_instruction,
            touched: false
        };

        let section_instruction = SectionInstruction::new(0, 0, 0);
        let section = Section::new(document.context(), section_instruction, Parent::Document(&document));

        document.add(Element::Section(section));

        document
    }

    pub fn string(&self, name: &str, required: bool) -> Result<Option<&str>, Error> {
        let elements_option = self.elements_associative.get(name);

        if let Some(elements) = elements_option {
            Ok(Some(&self.instruction.name))
        } else if required {
            let error = validation::missing_field(&self.context, &self.instruction);

            Err(error)
        } else {
            Ok(None)
        }
    }
}
