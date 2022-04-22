import enolib

input = '''
field:
- one
- two
'''.strip()

field = enolib.parse(input).field()

def test_has_only_untouched_items_after_initialization():
    virgin_field = enolib.parse(input).field()

    for item in virgin_field.items():
        assert not hasattr(item, '_touched')

def test_items_touches_the_field_itself():
    virgin_field = enolib.parse(input).field()
    virgin_field.items()

    assert hasattr(virgin_field, '_touched')

def test_items_does_not_touch_the_items():
    virgin_field = enolib.parse(input).field()

    for item in virgin_field.items():
        assert not hasattr(item, '_touched')

def test_required_string_values_returns_the_values():
    assert field.required_string_values() == ['one', 'two']

def test_required_string_values_touches_the_field_itself():
    virgin_field = enolib.parse(input).field()
    virgin_field.required_string_values()

    assert hasattr(field, '_touched')

def test_required_string_values_touches_all_items():
    virgin_field = enolib.parse(input).field()
    virgin_field.required_string_values()

    for item in virgin_field.items():
        assert hasattr(item, '_touched')

def test_required_values_returns_the_processed_values():
    assert field.required_values(lambda value: value.upper()) == ['ONE', 'TWO']

def test_required_values_touches_the_field_itself():
    field.required_values(lambda value: value.upper())

    assert hasattr(field, '_touched')

def test_required_values_touches_all_items():
    field.required_values(lambda value: value.upper())

    for item in field.items():
        assert hasattr(item, '_touched')

def test_length_returns_the_number_of_items_in_the_field():
    assert field.length() == 2

def test_repr_returns_a_debug_representation():
    assert repr(field) == '<class Field key=field items=2>'

def test_touch_touches_the_items():
    virgin_field = enolib.parse(input).field()
    virgin_field.touch()

    for item in field.items():
        assert hasattr(item, '_touched')
