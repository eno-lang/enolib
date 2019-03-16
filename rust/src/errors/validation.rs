use crate::context::Context;
use crate::error::{Error, Metadata};
use crate::instruction::SectionInstruction;

pub fn missing_field(context: &Context, instruction: &SectionInstruction) -> Error {
    let text = format!("Missing value for field {}", instruction.name);  // TODO: Use actual localized message closure
    let snippet = String::from("TODO");
    let selection = [[0, 0], [0, 0]];

    Error::ValidationError(Metadata::new(text, snippet, selection))
}
