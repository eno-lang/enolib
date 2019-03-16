use std::collections::HashMap;

use crate::context::Context;
use crate::error::Error;
use crate::errors::validation;
use crate::instruction::SectionInstruction;
use super::element::Element;

const DOCUMENT_NAME: &str = "<>#:=|\\_ENO_DOCUMENT";

pub struct Section<'a> {
    context: &'a Context<'a>,
    elements: Vec<Element<'a>>,
    elements_associative: HashMap<&'a str, Vec<&'a Element<'a>>>,
    instruction: SectionInstruction,
    parent: Option<Box<Section<'a>>>,
    touched: bool
}

impl<'a> Section<'a> {
    pub fn name(&self) -> &str {
        &self.instruction.name
    }

    pub fn document(context: &'a Context<'a>) -> Section<'a> {
        let mut instruction = SectionInstruction::new(0, 0, 0);

        instruction.name =  String::from(DOCUMENT_NAME);

        Section::new(context, instruction, None)
    }

    pub fn new(context: &'a Context<'a>, instruction: SectionInstruction, parent: Option<Section<'a>>) -> Section<'a> {
        Section {
            context,
            elements: Vec::new(),
            elements_associative: HashMap::new(),
            instruction,
            parent: match parent {
                Some(parent) => Some(Box::new(parent)),
                None => None
            },
            touched: false
        }
    }

    pub fn parent(&self) -> Option<&Section> {
        match self.parent {
            Some(ref section) => Some(&*section),
            None => None
        }
    }

    pub fn string(&self, name: &str, required: bool) -> Result<Option<&str>, Error> {
        let elements_option = self.elements_associative.get(name);

        if let Some(elements) = elements_option {
            Ok(Some(&self.instruction.name))
        } else if required {
            let error = validation::missing_field(self.context, &self.instruction);

            Err(error)
        } else {
            Ok(None)
        }
    }
}
