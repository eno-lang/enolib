import enolib

input = '''
fieldset:
entry = entry value
other = other value
'''.strip()

entry = enolib.parse(input).fieldset().entry('entry')

def test_required_string_value_returns_the_value():
  assert entry.required_string_value() == 'entry value'

def test_required_string_value_touches_the_fieldset_itself():
  virgin_entry = enolib.parse(input).fieldset().entry('entry')
  virgin_entry.required_string_value()

  assert hasattr(virgin_entry, '_touched')

def test_required_value_returns_the_processed_value():
  assert entry.required_value(lambda value: value.upper()) == 'ENTRY VALUE'

def test_required_value_touches_the_fieldset_itself():
  virgin_entry = enolib.parse(input).fieldset().entry('entry')
  virgin_entry.required_string_value()
  virgin_entry.required_value(lambda value: value.upper())

  assert hasattr(virgin_entry, '_touched')
