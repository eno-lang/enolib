import enolib

input = '''
list:
- one
- two
'''.strip()

list = enolib.parse(input).list()

def test_untouched_after_initialization():
    virgin_list = enolib.parse(input).list()

    assert not hasattr(virgin_list, '_touched')

def test_has_only_untouched_items_after_initialization():
    virgin_list = enolib.parse(input).list()

    assert not hasattr( virgin_list.items()[0], '_touched')


def test_items_touches_the_list_itself():
    virgin_list = enolib.parse(input).list()
    virgin_list.items()

    assert hasattr(virgin_list, '_touched')

def test_items_does_not_touch_the_list_items():
    virgin_list = enolib.parse(input).list()

    for item in   virgin_list.items():
        assert not hasattr(item, '_touched')

def test_required_string_values_returns_the_values():
    assert list.required_string_values() == ['one', 'two']

def test_required_string_values_touches_the_list_itself():
    virgin_list = enolib.parse(input).list()
    virgin_list.required_string_values()

    assert hasattr(list, '_touched')

def test_required_string_values_touches_all_list_items():
    virgin_list = enolib.parse(input).list()
    virgin_list.required_string_values()

    for item in   virgin_list.items():
        assert hasattr(item, '_touched')

def test_required_values_returns_the_processed_values():
    assert list.required_values(lambda value: value.upper()) == ['ONE', 'TWO']

def test_required_values_touches_the_list_itself():
    list.required_values(lambda value: value.upper())

    assert hasattr(list, '_touched')

def test_required_values_touches_all_list_items():
    list.required_values(lambda value: value.upper())

    for item in list.items():
        assert hasattr(item, '_touched')

def test_length_returns_the_number_of_items_in_the_list():
    assert list.length() == 2

def test_raw_returns_a_native_representation():
    assert list.raw() == {
      'items': [
            {
                'type': 'list_item',
                'value': 'one'
            },
            {
                'type': 'list_item',
                'value': 'two'
            }
        ],
        'key': 'list',
        'type': 'list'
    }

def test_repr_returns_a_debug_representation():
    assert repr(list) == '<class List key=list items=2>'

def test_touch_touches_the_list_itself():
    virgin_list = enolib.parse(input).list()
    virgin_list.touch()

    assert hasattr(list, '_touched')

def test_touch_touches_the_list_items():
    virgin_list = enolib.parse(input).list()
    virgin_list.touch()

    for item in list.items():
        assert hasattr(item, '_touched')
