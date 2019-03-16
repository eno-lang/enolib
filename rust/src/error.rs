#[derive(Debug, Clone)]
pub enum Error {
    ParseError(Metadata),
    ValidationError(Metadata)
}

impl Error {
    pub fn cursor(&self) -> [i32; 2] {
        match *self {
            Error::ParseError(ref meta) => meta.cursor(),
            Error::ValidationError(ref meta) => meta.cursor()
        }
    }

    pub fn selection(&self) -> [[i32; 2]; 2] {
        match *self {
            Error::ParseError(ref meta) => meta.selection(),
            Error::ValidationError(ref meta) => meta.selection()
        }
    }

    pub fn snippet(&self) -> &str {
        match *self {
            Error::ParseError(ref meta) => meta.snippet(),
            Error::ValidationError(ref meta) => meta.snippet()
        }
    }

    pub fn text(&self) -> &str {
        match *self {
            Error::ParseError(ref meta) => meta.text(),
            Error::ValidationError(ref meta) => meta.text()
        }
    }
}

impl std::fmt::Display for Error {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match *self {
            Error::ParseError(ref meta) => write!(f, "{}\n{}", meta.text(), meta.snippet()),
            Error::ValidationError(ref meta) => write!(f, "{}\n{}", meta.text(), meta.snippet())
        }
    }
}

impl std::error::Error for Error {
    fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
        None
    }
}

#[derive(Debug, Clone)]
pub struct Metadata {
    range: [[i32; 2]; 2],
    snippet: String,
    text: String
}

impl Metadata {
    pub fn cursor(&self) -> [i32; 2] {
        self.range[0]
    }

    pub fn new(text: String, snippet: String, range: [[i32; 2]; 2]) -> Metadata {
        Metadata {
            range,
            snippet,
            text
        }
    }

    pub fn selection(&self) -> [[i32; 2]; 2] {
        self.range
    }

    pub fn snippet(&self) -> &str {
        &self.snippet
    }

    pub fn text(&self) -> &str {
        &self.text
    }
}
