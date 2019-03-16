pub enum Locale {
    De,
    En,
    Es
}

pub fn was_generated(locale: Locale, field_name: &str) -> String {
    match locale {
        Locale::De => format!("Diese Nachricht wurde generiert für ein Feld namens: '{}'", field_name),
        Locale::En => format!("This message was generated for a field called: '{}'", field_name),
        Locale::Es => format!("Este mensaje fue generado para una casilla con el nombre: '{}'", field_name),
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn test_was_generated_de() {
        assert_eq!(was_generated(Locale::De, "my field"), "Diese Nachricht wurde generiert für ein Feld namens: 'my field'");
    }

    #[test]
    fn test_was_generated_en() {
        assert_eq!(was_generated(Locale::En, "my field"), "This message was generated for a field called: 'my field'");
    }

    #[test]
    fn test_was_generated_es() {
        assert_eq!(was_generated(Locale::Es, "my field"), "Este mensaje fue generado para una casilla con el nombre: 'my field'");
    }
}
