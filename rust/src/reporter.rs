use crate::context::Context;
use crate::instruction::Instruction;

// TODO: Possibly rethink Reporter terminology (TraceFormatter or something like that?)

pub enum Reporter {
    Html,
    Terminal,
    Text
}

impl Reporter {
    // TODO: Instruction enum wrapping might turn out to be a little cumbersome here, possibly reconsider in that case
    pub fn report(&self, context: &Context, emphasized: Vec<&Instruction>, marked: Vec<&Instruction>) -> String {
        let mut snippet = String::new();

        snippet.push_str("TODO: Header construction from translated strings");

        let mut in_omission = false;

        for instruction in &context.instructions {
            let emphasize = emphasized.iter().any(|emphasized_iterated| instruction as *const Instruction == *emphasized_iterated as *const Instruction);
            let mark = marked.iter().any(|marked_iterated| instruction as *const Instruction == *marked_iterated as *const Instruction);
            // let show = false;  TODO: Determine neighboring lines of emphasized/marked lines

            if emphasize {
                match *self {
                    Reporter::Html => snippet.push_str("TODO Html"),
                    Reporter::Terminal => snippet.push_str("TODO Terminal"),
                    Reporter::Text => snippet.push_str("TODO Text")
                }
            }
        }

        snippet
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn html_reporter() {
        let input = String::from("");
        let context = Context::new(&input, Reporter::Html, None, false);
        let snippet = context.reporter.report(&context, vec![], vec![]);

        assert_eq!(snippet, "TODO: Header construction from translated strings");
    }

    #[test]
    fn terminal_reporter() {
        let input = String::from("");
        let context = Context::new(&input, Reporter::Terminal, None, false);
        let snippet = context.reporter.report(&context, vec![], vec![]);

        assert_eq!(snippet, "TODO: Header construction from translated strings");
    }

    #[test]
    fn text_reporter() {
        let input = String::from("");
        let context = Context::new(&input, Reporter::Text, None, false);
        let snippet = context.reporter.report(&context, vec![], vec![]);

        assert_eq!(snippet, "TODO: Header construction from translated strings");
    }
}
