import enolib
import pytest
from enolib import ValidationError

from tests.util import snapshot

input = '''
-- embed
value
-- embed
'''.strip()

def test_untouched_after_initialization():
    embed = enolib.parse(input).embed('embed')

    assert hasattr(embed, '_touched') is False

def test_error_with_a_message_returns_a_custom_error():
    embed = enolib.parse(input).embed('embed')
    error = embed.error('my custom error')

    assert isinstance(error, ValidationError)
    assert str(error.message) == snapshot(str(error.message), 'tests/elements/snapshots/embed_error_with_a_message_returns_a_custom_error.snap.txt')

def test_error_with_a_message_function_returns_a_custom_error():
    embed = enolib.parse(input).embed('embed')
    error = embed.error(lambda element: f"my custom generated message for element '{element.string_key()}'")

    assert isinstance(error, ValidationError)
    assert str(error.message) == snapshot(str(error.message), 'tests/elements/snapshots/embed_error_with_a_message_function_returns_a_custom_error.snap.txt')

def test_repr_returns_a_debug_representation():
    embed = enolib.parse(input).embed('embed')

    assert repr(embed) == '<class Embed key=embed value=value>'

def test_touch_touches_the_element():
    embed = enolib.parse(input).embed('embed')
    embed.touch()

    assert hasattr(embed, '_touched') is True
