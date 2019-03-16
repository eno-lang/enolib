use super::empty::Empty;
use super::field::Field;
use super::fieldset::Fieldset;
use super::list::List;
use super::section::Section;

pub enum Element<'a> {
    Empty(Empty),
    Field(Field),
    Fieldset(Fieldset),
    List(List),
    Section(Section<'a>)
}
