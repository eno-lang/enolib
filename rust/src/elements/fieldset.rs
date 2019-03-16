use crate::instruction::FieldsetInstruction;

pub struct Fieldset {
    instruction: FieldsetInstruction,
    touched: bool
}

impl Fieldset {
    pub fn name(&self) -> &str {
        &self.instruction.name
    }

    pub fn new(instruction: FieldsetInstruction) -> Fieldset {
        Fieldset {
            instruction: instruction,
            touched: false
        }
    }
}
