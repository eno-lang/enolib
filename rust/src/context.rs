use crate::instruction::Instruction;
use crate::reporter::Reporter;

pub struct Context<'a> {
    pub indexing: u8,
    pub input: &'a str,
    pub instructions: Vec<Instruction>,
    pub reporter: Reporter,
    pub source_label: Option<String>
}

impl<'a> Context<'a> {
    pub fn new(input: &str, reporter: Reporter, source_label: Option<String>, zero_indexing: bool) -> Context {
        Context {
            indexing: if zero_indexing { 0 } else { 1 },
            input: input,
            instructions: Vec::new(),
            reporter: reporter,
            source_label: source_label
        }
    }
}
