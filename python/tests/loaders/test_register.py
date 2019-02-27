import enolib
import pytest
from enolib import ValidationError
from tests.util import snapshot

input = '''
> comment
field: value

> comment
fieldset:
entry = value

> comment
list:
- value

> comment
# section
'''.strip()

enolib.register(custom=lambda value: f"custom {value}")

document = enolib.parse(input)

field = document.field('field')
fieldset = document.fieldset('fieldset')
list = document.list('list')
section = document.section('section')

missing_field = document.field('missing')
missing_fieldset = document.fieldset('missing')
missing_list = document.list('missing')
missing_section = document.section('missing')

# on field

def test_on_field_registers_an_optional_custom_comment_accessor():
  assert field.optional_custom_comment() == 'custom comment'

def test_on_field_registers_a_required_custom_comment_accessor():
  assert field.required_custom_comment() == 'custom comment'

def test_on_field_registers_a_custom_key_accessor():
  assert field.custom_key() == 'custom field'

def test_on_field_registers_an_optional_custom_value_accessor():
  assert field.optional_custom_value() == 'custom value'

def test_on_field_registers_a_required_custom_value_accessor():
  assert field.required_custom_value() == 'custom value'

# on fieldset

def test_on_fieldset_registers_an_optional_custom_comment_accessor():
  assert fieldset.optional_custom_comment() == 'custom comment'

def test_on_fieldset_registers_a_required_custom_comment_accessor():
  assert fieldset.required_custom_comment() == 'custom comment'

def test_on_fieldset_registers_a_custom_key_accessor():
  assert fieldset.custom_key() == 'custom fieldset'

# on list

def test_on_list_registers_an_optional_custom_comment_accessor():
  assert list.optional_custom_comment() == 'custom comment'

def test_on_list_registers_a_required_custom_comment_accessor():
  assert list.required_custom_comment() == 'custom comment'

def test_on_list_registers_a_custom_key_accessor():
  assert list.custom_key() == 'custom list'

def test_on_list_registers_an_optional_custom_values_accessor():
  assert list.optional_custom_values() == ['custom value']

def test_on_list_registers_a_required_custom_values_accessor():
  assert list.required_custom_values() == ['custom value']

# on section

def test_on_section_registers_an_optional_custom_comment_accessor():
  assert section.optional_custom_comment() == 'custom comment'

def test_on_section_registers_a_required_custom_comment_accessor():
  assert section.required_custom_comment() == 'custom comment'

def test_on_section_registers_a_custom_key_accessor():
  assert section.custom_key() == 'custom section'

# on missing field

def test_on_missing_field_registers_an_optional_custom_comment_accessor():
  assert missing_field.optional_custom_comment() is None

def test_on_missing_field_registers_a_required_custom_comment_accessor():
  with pytest.raises(ValidationError) as excinfo:
    assert missing_field.required_custom_comment()

def test_on_missing_field_registers_a_custom_key_accessor():
  with pytest.raises(ValidationError) as excinfo:
    assert missing_field.custom_key()

def test_on_missing_field_registers_an_optional_custom_value_accessor():
  assert missing_field.optional_custom_value() is None

def test_on_missing_field_registers_a_required_custom_value_accessor():
  with pytest.raises(ValidationError) as excinfo:
    assert missing_field.required_custom_value()

# on missing fieldset

def test_on_missing_fieldset_registers_an_optional_custom_comment_accessor():
  assert missing_fieldset.optional_custom_comment() is None

def test_on_missing_fieldset_registers_a_required_custom_comment_accessor():
  with pytest.raises(ValidationError) as excinfo:
    assert missing_fieldset.required_custom_comment()

def test_on_missing_fieldset_registers_a_custom_key_accessor():
  with pytest.raises(ValidationError) as excinfo:
    assert missing_fieldset.custom_key()

# on missing list

def test_on_missing_list_registers_an_optional_custom_comment_accessor():
  assert missing_list.optional_custom_comment() is None

def test_on_missing_list_registers_a_required_custom_comment_accessor():
  with pytest.raises(ValidationError) as excinfo:
    assert missing_list.required_custom_comment()

def test_on_missing_list_registers_a_custom_key_accessor():
  with pytest.raises(ValidationError) as excinfo:
    assert missing_list.custom_key()

def test_on_missing_list_registers_an_optional_custom_values_accessor():
  assert missing_list.optional_custom_values() == []

def test_on_missing_list_registers_a_required_custom_values_accessor():
  assert missing_list.required_custom_values() == []

# on missing section

def test_on_missing_section_registers_an_optional_custom_comment_accessor():
  assert missing_section.optional_custom_comment() is None

def test_on_missing_section_registers_a_required_custom_comment_accessor():
  with pytest.raises(ValidationError) as excinfo:
    assert missing_section.required_custom_comment()

def test_on_missing_section_registers_a_custom_key_accessor():
  with pytest.raises(ValidationError) as excinfo:
    assert missing_section.custom_key()
