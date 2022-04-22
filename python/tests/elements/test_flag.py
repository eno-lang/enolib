import enolib
import pytest
from enolib import ValidationError

from tests.util import snapshot

def test_untouched_after_initialization():
    flag = enolib.parse('flag').flag('flag')

    assert hasattr(flag, '_touched') is False

def test_error_with_a_message_returns_a_custom_error():
    flag = enolib.parse('flag').flag('flag')
    error = flag.error('my custom error')

    assert isinstance(error, ValidationError)
    assert str(error.message) == snapshot(str(error.message), 'tests/elements/snapshots/flag_error_with_a_message_returns_a_custom_error.snap.txt')

def test_error_with_a_message_function_returns_a_custom_error():
    flag = enolib.parse('flag').flag('flag')
    error = flag.error(lambda element: f"my custom generated message for element '{element.string_key()}'")

    assert isinstance(error, ValidationError)
    assert str(error.message) == snapshot(str(error.message), 'tests/elements/snapshots/flag_error_with_a_message_function_returns_a_custom_error.snap.txt')

def test_repr_returns_a_debug_representation():
    flag = enolib.parse('flag').flag('flag')

    assert repr(flag) == '<class Flag key=flag>'

def test_touch_touches_the_element():
    flag = enolib.parse('flag').flag('flag')
    flag.touch()

    assert hasattr(flag, '_touched') is True
