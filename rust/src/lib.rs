pub mod context;      // TODO: Make this private again and figure out a non-distracting place for internal unit tests that access private stuff
mod errors;
pub mod instruction;  // TODO: Make this private again and figure out a non-distracting place for internal unit tests that access private stuff
mod tokenizer;

pub mod elements;
pub mod error;
pub mod loaders;
pub mod messages;
pub mod reporter;

use crate::context::Context;
use crate::elements::section::Section;
use crate::error::Error;
use crate::reporter::Reporter;
use crate::tokenizer::tokenize;

// TODO: Integrate -> Result<Section, Error> again when solution for context owner is found
pub fn parse(input: &str, zero_indexing: bool) {
    let mut context = Context::new(input, Reporter::Text, Some(String::new()), zero_indexing);

    tokenize(&mut context);

    let document = Section::document(&context);

    // Ok(document)
}
