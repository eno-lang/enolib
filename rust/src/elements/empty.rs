use crate::instruction::EmptyInstruction;

pub struct Empty {
    instruction: EmptyInstruction,
    touched: bool
}

impl Empty {
    pub fn name(&self) -> &str {
        &self.instruction.name
    }

    pub fn new(instruction: EmptyInstruction) -> Empty {
        Empty {
            instruction: instruction,
            touched: false
        }
    }

    pub fn value(&self) -> Option<String> {
        None
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use crate::instruction::{EmptyInstruction, Location};

    fn get_empty() -> Empty {
        Empty::new(EmptyInstruction {
            escape_operator_ranges: None,
            location: Location {
                index: 0,
                length: 0,
                line: 0
            },
            name: String::from("my empty"),
            name_operator_range: [8, 9],
            name_range: [0, 8]
        })
    }

    #[test]
    fn empty() {
        let empty = get_empty();

        assert_eq!(empty.value(), None);
    }
}
