use crate::instruction::ListInstruction;

pub struct List {
    instruction: ListInstruction,
    touched: bool
}

impl List {
    pub fn name(&self) -> &str {
        &self.instruction.name
    }

    pub fn new(instruction: ListInstruction) -> List {
        List {
            instruction: instruction,
            touched: false
        }
    }
}
