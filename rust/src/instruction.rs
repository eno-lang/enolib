pub enum Copy {
    Deep,
    Not,
    Shallow
}

pub struct CommentInstruction {
    pub comment_range: Option<(usize, usize)>,
    pub comment: Option<String>,
    pub location: Location,
    pub operator_range: (usize, usize)
}

impl CommentInstruction {
    pub fn new(index: u32, line: u32) -> CommentInstruction {
        CommentInstruction {
            comment_range: None,
            comment: None,
            location: Location {
                index,
                length: 0,
                line
            },
            operator_range: (0, 0)
        }
    }
}

pub struct EmptyInstruction {
    pub escape_operator_ranges: Option<[[u32; 2]; 2]>,
    pub location: Location,
    pub name: String,
    pub name_operator_range: [u32; 2],
    pub name_range: [u32; 2]
}

pub struct FieldInstruction {
    pub escape_operator_ranges: Option<[[u32; 2]; 2]>,
    pub location: Location,
    pub name: String,
    pub name_operator_range: [u32; 2],
    pub name_range: [u32; 2],
    pub value_range: [u32; 2]
}

pub struct FieldsetInstruction {
    pub escape_operator_ranges: Option<[[u32; 2]; 2]>,
    pub location: Location,
    pub name: String,
    pub name_operator_range: [u32; 2],
    pub name_range: [u32; 2]
}

pub struct ListInstruction {
    pub escape_operator_ranges: Option<[[u32; 2]; 2]>,
    pub location: Location,
    pub name: String,
    pub name_operator_range: [u32; 2],
    pub name_range: [u32; 2]
}

pub struct SectionInstruction {
    pub copy: Copy,
    pub depth: u16,
    pub copy_operator_range: Option<[u32; 2]>,
    pub escape_operator_ranges: Option<[[u32; 2]; 2]>,
    pub location: Location,
    pub name: String,
    pub name_range: [u32; 2],
    pub section_operator_range: [u32; 2],
    pub template_range: Option<[u32; 2]>
}

pub struct Location {
    pub index: u32,
    pub length: u32,
    pub line: u32
}

pub enum Instruction {
    Comment(CommentInstruction),
    Empty(EmptyInstruction),
    Field(FieldInstruction),
    Fieldset(FieldsetInstruction),
    List(ListInstruction),
    Section(SectionInstruction)
}

impl SectionInstruction {
    pub fn new(index: u32, length: u32, line: u32) -> SectionInstruction {
        SectionInstruction {
            copy: Copy::Not,
            depth: 0,
            copy_operator_range: None,
            escape_operator_ranges: None,
            location: Location {
                index,
                length,
                line
            },
            name: String::new(),
            name_range: [0, 0],
            section_operator_range: [0, 0],
            template_range: None
        }
    }
}
