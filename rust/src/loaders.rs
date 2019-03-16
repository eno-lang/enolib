pub fn boolean(value: &str) -> Result<bool, &str> {
    match value {
        "yes" => Ok(true),
        "no" => Ok(false),
        "true" => Ok(true),
        "false" => Ok(false),
        _ => Err("Value is not a boolean, allowed values are 'true', 'false', 'yes' and 'no'.")
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn boolean_yes() {
        assert_eq!(boolean("yes").ok(), Some(true));
    }

    #[test]
    fn boolean_no() {
        assert_eq!(boolean("no").ok(), Some(false));
    }

    #[test]
    fn boolean_true() {
        assert_eq!(boolean("true").ok(), Some(true));
    }

    #[test]
    fn boolean_false() {
        assert_eq!(boolean("false").ok(), Some(false));
    }

    #[test]
    fn boolean_invalid() {
        assert_eq!(boolean("invalid").err(), Some("Value is not a boolean, allowed values are 'true', 'false', 'yes' and 'no'."));
    }
}
