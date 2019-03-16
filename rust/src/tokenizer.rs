use crate::context::Context;
use crate::instruction::{CommentInstruction, Instruction};

// TODO: Don't forget about the BOM and possibly check this for the existing eno parsers as well

struct PassableIterator<'a> {
    pub iterator : &'a mut dyn Iterator<Item = (usize, char)>,
}

struct Tokenizer<'a, 'b: 'a> {
    context: &'a mut Context<'b>,
    index: u32,
    line: u32
}

impl<'a, 'b: 'a> Tokenizer<'a, 'b> {
    pub fn new(context: &'a mut Context<'b>) -> Tokenizer<'a, 'b> {
        Tokenizer {
            context: context,
            index: 0,
            line: 0
        }
    }

    fn comment(&mut self, passable: &mut PassableIterator) {
        println!("comment");

        let mut instruction = CommentInstruction::new(self.index, self.line);

        match self.token(passable) {
            Some((token, range)) => {
                instruction.comment = Some(String::from(token));
                instruction.comment_range = Some(range);
            },
            None => ()
        }

        println!("TOKEN EXTRACTED >{:?}<", instruction.comment);

        while let Some((byte_offset, char)) = passable.iterator.next() {
            match char {
                '\n' => break,
                _ => print!("{}", char)
            }
        }

        self.context.instructions.push(Instruction::Comment(instruction));
    }

    fn list_item(&mut self, passable: &mut PassableIterator) {
        println!("List item");

        print!("\n");
    }

    fn name(&mut self, passable: &mut PassableIterator) {
        println!("Name");

        while let Some((byte_offset, char)) = passable.iterator.next() {
            match char {
                '\n' => panic!("Invalid line"),
                ':' => break,
                _ => print!("{}", char)
            }
        }

        println!("\nValue");

        while let Some((byte_offset, char)) = passable.iterator.next() {
            match char {
                '\n' => break,
                ':' => break,
                _ => print!("{}", char)
            }
        }

        print!("\n");
    }

    fn list_item_or_multiline_field(&mut self, passable: &mut PassableIterator) {
        if let Some((offset, char)) = passable.iterator.next() {
            match char {
                '-' => self.multiline_field(passable),
                _ => self.list_item(passable)
            }
        }
    }

    fn multiline_field(&mut self, passable: &mut PassableIterator) {
        // let mut peekable = iterator.peekable();
        //
        // if let Some((offset, char)) = peekable.peek() {
        //     match char {
        //         '-' => self.multiline_field(iterator),
        //         _ => self.list_item(iterator)
        //     }
        // }
    }

    fn pass_me_once(&mut self, passable: &mut PassableIterator) {
        // passable
        self.pass_me_twice(passable);
    }

    fn pass_me_twice(&mut self, passable: &mut PassableIterator) {
        // passable
        let (offset, char) = passable.iterator.next().unwrap();

        print!("{}", char);
    }

    pub fn run(&mut self) {
        let mut iterator = self.context.input.char_indices();
        let mut passable = PassableIterator { iterator: &mut iterator };

        // let instruction = Instruction::new(self.index, self.line);

        while let Some((byte_offset, char)) = passable.iterator.next() {
            print!("{}", char);

            if char.is_whitespace() {
                self.index += 1;
            } else {
                match char {
                    '>' => self.comment(&mut passable),
                    _ => ()
            //         '-' => self.list_item_or_multiline_field(&mut passable),
            //         // '>' => self.comment(&mut iterator),
            //         // ' ' | '\t' => (),
            //         // '\n' => self.line += 1,
            //         _ => self.pass_me_twice(&mut passable)
                }

                self.index += 1;
            }

            // self.context.instructions.push(instruction);
        }
    }

    fn token(&mut self, passable: &mut PassableIterator) -> Option<(&str, (usize, usize))> {
        let mut expand_token = false;
        let mut token_started = false;
        let mut begin_offset: usize = 0;
        let mut end_offset: usize = 0;

        loop {
            self.index += 1;    // TODO: The whole index concept needs to be rethought
                                //       It appears it at best makes sense as metadata for
                                //       usage in a more high-level environments, but its
                                //       useless in terms of string access.

            let byte_offset;
            let char;
            if let Some((_byte_offset, _char)) = passable.iterator.next() {
                byte_offset = _byte_offset;
                char = _char;
            } else {
                break;
            }

            if expand_token {
                end_offset = byte_offset;
                expand_token = false;
            }

            if !char.is_whitespace() {
                if !token_started {
                    begin_offset = byte_offset;
                    token_started = true;
                }

                expand_token = true;
            }

            if char == '\n' {
                self.line += 1;
                break
            }
        }

        if token_started {
            Some((&self.context.input[begin_offset..=end_offset], (begin_offset, end_offset)))
        } else {
            None
        }
    }
}

pub fn tokenize<'a, 'b: 'a>(context: &'a mut Context<'b>) {
    Tokenizer::new(context).run();
}
