import enolib
import pytest
import hypothesis

from enolib import ParseError

from tests.util import snapshot


def test_parse():
    document = enolib.parse('language: eno')

    assert document.field('language').required_string_value() == 'eno'

def test_parse_with_invalid_syntax():
    with pytest.raises(ParseError) as excinfo:
        enolib.parse('language eno')

    assert str(excinfo.value) == snapshot(str(excinfo.value), 'tests/snapshots/parse_with_invalid_syntax.snap.txt')

@hypothesis.given(hypothesis.strategies.text())
def test_fuzz(text):
    '''Only allow the parse method to raise ParseErrors.'''

    try:
        enolib.parse(text)
    except Exception as e:
        assert isinstance(e, ParseError)


if __name__ == '__main__':
    pytest.main()
