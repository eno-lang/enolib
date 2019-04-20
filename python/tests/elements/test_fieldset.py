import enolib

input = '''
fieldset:
entry = entry value
other = other value
'''.strip()

fieldset = enolib.parse(input).fieldset()

def test_untouched_after_initialization():
    virgin_fieldset = enolib.parse('fieldset:').fieldset()

    assert not hasattr(virgin_fieldset, '_touched')

def test_has_only_untouched_entries_after_initialization():
    virgin_entry = enolib.parse('fieldset:\nentry=value').fieldset().entry()

    assert not hasattr(virgin_entry, '_touched')

def test_has_all_entries_required_disabled_by_default():
    virgin_fieldset = enolib.parse('fieldset:').fieldset()

    assert fieldset._all_entries_required is False

def test_element_returns_the_right_element():
    assert fieldset.entry('entry').required_string_value() == 'entry value'

def test_entries_returns_all_entries():
    assert len(fieldset.entries()) == 2

def test_entries_touches_the_fieldset_itself():
    virgin_fieldset = enolib.parse('fieldset:\nentry=value').fieldset()
    virgin_fieldset.entries()

    assert hasattr(virgin_fieldset, '_touched')

def test_entries_does_not_touch_the_fieldset_entries():
    virgin_fieldset = enolib.parse('fieldset:\nentry=value').fieldset()
    virgin_fieldset.entries()

    assert not hasattr(virgin_fieldset.entry(), '_touched')

def test_all_entries_required_sets_the_all_entries_required_option():
    virgin_fieldset = enolib.parse('fieldset:').fieldset()
    virgin_fieldset.all_entries_required()

    assert virgin_fieldset._all_entries_required is True

def test_raw_returns_a_native_representation():
    assert fieldset.raw() == {
      'key': 'fieldset',
      'entries': [
          {
              'key': 'entry',
              'value': 'entry value',
              'type': 'fieldset_entry'
          },
          {
              'key': 'other',
              'value': 'other value',
              'type': 'fieldset_entry'
          }
      ],
      'type': 'fieldset'
    }

def test_repr_returns_a_debug_representation():
    assert repr(fieldset) == '<class Fieldset key=fieldset entries=2>'

def test_touch_touches_the_fieldset_itself():
    virgin_fieldset = enolib.parse('fieldset:').fieldset()
    virgin_fieldset.touch()

    assert hasattr(virgin_fieldset, '_touched')

def test_touch_touches_the_fieldset_entries():
    virgin_fieldset = enolib.parse('fieldset:\nentry = value').fieldset()
    virgin_fieldset.touch()

    assert hasattr(virgin_fieldset.entry(), '_touched')
