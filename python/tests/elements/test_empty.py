import enolib
import pytest
from enolib import ValidationError

from tests.util import snapshot

def test_untouched_after_initialization():
  empty = enolib.parse('element:').empty('element')

  assert hasattr(empty, '_touched') is False

def test_error_with_a_message_returns_a_custom_error():
  empty = enolib.parse('element:').empty('element')
  error = empty.error('my custom error')

  assert isinstance(error, ValidationError)
  assert str(error.message) == snapshot(str(error.message), 'tests/elements/snapshots/empty_error_with_a_message_returns_a_custom_error.snap.txt')

def test_error_with_a_message_function_returns_a_custom_error():
  empty = enolib.parse('element:').empty('element')
  error = empty.error(lambda element: f"my custom generated message for element '{element.string_key()}'")

  assert isinstance(error, ValidationError)
  assert str(error.message) == snapshot(str(error.message), 'tests/elements/snapshots/empty_error_with_a_message_function_returns_a_custom_error.snap.txt')

def test_raw_with_a_key_returns_native_representation():
  empty = enolib.parse('element:').empty('element')

  assert empty.raw() == { 'key': 'element', 'type': 'empty_element' }

def test_repr_returns_a_debug_representation():
  empty = enolib.parse('element:').empty('element')

  assert repr(empty) == '<class Empty key=element>'

def test_touch_touches_the_element():
  empty = enolib.parse('element:').empty('element')
  empty.touch()

  assert hasattr(empty, '_touched') is True
