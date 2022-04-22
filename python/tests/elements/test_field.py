import enolib
import pytest
from enolib import ValidationError

from tests.util import snapshot

empty_field = enolib.parse('field:').field()
field = enolib.parse('field: value').field()

def test_untouched_after_initialization():
    virgin_field = enolib.parse('field: value').field()
    assert not hasattr(virgin_field, '_touched')

def test_error_with_a_message_returns_a_custom_error():
    error = field.error('my custom error')

    assert isinstance(error, ValidationError)
    assert str(error.message) == snapshot(str(error.message), 'tests/elements/snapshots/field_error_with_a_message_returns_a_custom_error.snap.txt')

def test_error_with_a_message_function_returns_a_custom_error():
    error = field.error(lambda element: f"my custom generated message for element {element.string_key()}")

    assert isinstance(error, ValidationError)
    assert str(error.message) == snapshot(str(error.message), 'tests/elements/snapshots/field_error_with_a_message_function_returns_a_custom_error.snap.txt')

def test_repr_with_key_and_value_returns_a_debug_representation():
    assert repr(field) == '<class Field key=field value=value>'

def test_repr_with_key_and_no_value_returns_a_debug_representation():
    assert repr(empty_field) == '<class Field key=field>'

def test_touch_touches_the_element():
    virgin_field = enolib.parse('field: value').field()
    virgin_field.touch()

    assert hasattr(virgin_field ,'_touched')

def test_required_string_value_returns_the_value():
    assert field.required_string_value() == 'value'

def test_required_string_value_touches_the_element():
    virgin_field = enolib.parse('field: value').field()
    virgin_field.required_string_value()

    assert hasattr(virgin_field ,'_touched')
    
def test_touch_touches_the_field_itself():
    virgin_field = enolib.parse('field:').field()
    virgin_field.touch()

    assert hasattr(virgin_field, '_touched')

def test_value_with_a_loader_returns_the_processed_value():
    assert field.required_value(lambda value: value.upper()) == 'VALUE'

def test_value_with_a_loader_touches_the_element():
    virgin_field = enolib.parse('field: value').field()
    virgin_field.required_value(lambda value: value.upper())

    assert hasattr(virgin_field ,'_touched')

def test_required_value_with_invalid_value_raises_error():
    def loader(value):
        if value == 'value':
            raise ValueError("value cannot be 'value'")

    with pytest.raises(ValidationError) as excinfo:
        field.required_value(loader)

    assert excinfo.value.message == snapshot(excinfo.value.message, 'tests/elements/snapshots/required_value_with_invalid_value_raises_error.snap.txt')

def test_optional_string_value_without_a_value_returns_none():
    assert empty_field.optional_string_value() == None

def test_required_string_value_without_a_value_raises_error():
    with pytest.raises(ValidationError) as excinfo:
        empty_field.required_string_value()

    assert excinfo.value.message == snapshot(excinfo.value.message, 'tests/elements/snapshots/required_string_value_without_a_value_raises_error.snap.txt')
