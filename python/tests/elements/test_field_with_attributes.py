import enolib

input = '''
field:
attribute = value
other = other value
'''.strip()

field = enolib.parse(input).field()

def test_has_only_untouched_attributes_after_initialization():
    virgin_field = enolib.parse('field:\nattribute=value').field()

    for attribute in virgin_field.attributes():
        assert not hasattr(attribute, '_touched')

def test_has_all_attributes_required_disabled_by_default():
    virgin_field = enolib.parse('field:').field()

    assert field._all_attributes_required is False

def test_element_returns_the_right_element():
    assert field.attribute('attribute').required_string_value() == 'value'

def test_attributes_returns_all_attributes():
    assert len(field.attributes()) == 2

def test_attributes_touches_the_field_itself():
    virgin_field = enolib.parse('field:\nattribute=value').field()
    virgin_field.attributes()

    assert hasattr(virgin_field, '_touched')

def test_attributes_does_not_touch_the_attributes():
    virgin_field = enolib.parse('field:\nattribute=value').field()
    virgin_field.attributes()

    assert not hasattr(virgin_field.attribute(), '_touched')

def test_all_attributes_required_sets_the_all_attributes_required_option():
    virgin_field = enolib.parse('field:').field()
    virgin_field.all_attributes_required()

    assert virgin_field._all_attributes_required is True

def test_repr_returns_a_debug_representation():
    assert repr(field) == '<class Field key=field attributes=2>'

def test_touch_touches_the_attributes():
    virgin_field = enolib.parse('field:\nattribute = value').field()
    virgin_field.touch()

    assert hasattr(virgin_field.attribute(), '_touched')
