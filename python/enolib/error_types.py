class Error(Exception):
    def __init__(self, text, snippet, selection):
        super().__init__(f"{text}\n\n{snippet}")

        self.cursor = selection['from']
        self.message = f"{text}\n\n{snippet}"
        self.selection = selection
        self.snippet = snippet
        self.text = text


class ParseError(Error):
    pass


class ValidationError(Error):
    pass
