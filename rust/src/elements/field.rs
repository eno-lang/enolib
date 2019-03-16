use crate::instruction::FieldInstruction;

pub struct Field {
    instruction: FieldInstruction,
    touched: bool
}

impl Field {
    pub fn name(&self) -> &str {
        &self.instruction.name
    }

    pub fn new(instruction: FieldInstruction) -> Field {
        Field {
            instruction: instruction,
            touched: false
        }
    }
}
