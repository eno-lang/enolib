import enolib

input = '''
field_with_attributes:
attribute = value
other = other value
'''.strip()

attribute = enolib.parse(input).field().attribute('attribute')

def test_required_string_value_returns_the_value():
    assert attribute.required_string_value() == 'value'

def test_required_string_value_touches_the_field_itself():
    virgin_attribute = enolib.parse(input).field().attribute('attribute')
    virgin_attribute.required_string_value()

    assert hasattr(virgin_attribute, '_touched')

def test_required_value_returns_the_processed_value():
    assert attribute.required_value(lambda value: value.upper()) == 'VALUE'

def test_required_value_touches_the_field_itself():
    virgin_attribute = enolib.parse(input).field().attribute('attribute')
    virgin_attribute.required_string_value()
    virgin_attribute.required_value(lambda value: value.upper())

    assert hasattr(virgin_attribute, '_touched')
