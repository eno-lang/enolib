import enolib
import pytest
from enolib import ValidationError
from tests.util import snapshot

input = '''
> comment
field: value

> comment
field_with_attributes:
attribute = value

> comment
field_with_items:
- item

> comment
# section
'''.strip()

enolib.register(custom=lambda value: f"custom {value}")

document = enolib.parse(input)

field = document.field('field')
field_with_attributes = document.field('field_with_attributes')
field_with_items = document.field('field_with_items')
section = document.section('section')

missing_field = document.field('missing')
missing_field_with_attributes = document.field('missing')
missing_field_with_items = document.field('missing')
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

# on field_with_attributes

def test_on_field_with_attributes_registers_an_optional_custom_comment_accessor():
    assert field_with_attributes.optional_custom_comment() == 'custom comment'

def test_on_field_with_attributes_registers_a_required_custom_comment_accessor():
    assert field_with_attributes.required_custom_comment() == 'custom comment'

def test_on_field_with_attributes_registers_a_custom_key_accessor():
    assert field_with_attributes.custom_key() == 'custom field_with_attributes'

# on field_with_items

def test_on_field_with_items_registers_an_optional_custom_comment_accessor():
    assert field_with_items.optional_custom_comment() == 'custom comment'

def test_on_field_with_items_registers_a_required_custom_comment_accessor():
    assert field_with_items.required_custom_comment() == 'custom comment'

def test_on_field_with_items_registers_a_custom_key_accessor():
    assert field_with_items.custom_key() == 'custom field_with_items'

def test_on_field_with_items_registers_an_optional_custom_values_accessor():
    assert field_with_items.optional_custom_values() == ['custom item']

def test_on_field_with_items_registers_a_required_custom_values_accessor():
    assert field_with_items.required_custom_values() == ['custom item']

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

# on missing field_with_attributes

def test_on_missing_field_with_attributes_registers_an_optional_custom_comment_accessor():
    assert missing_field_with_attributes.optional_custom_comment() is None

def test_on_missing_field_with_attributes_registers_a_required_custom_comment_accessor():
    with pytest.raises(ValidationError) as excinfo:
        assert missing_field_with_attributes.required_custom_comment()

def test_on_missing_field_with_attributes_registers_a_custom_key_accessor():
    with pytest.raises(ValidationError) as excinfo:
        assert missing_field_with_attributes.custom_key()

# on missing field_with_items

def test_on_missing_field_with_items_registers_an_optional_custom_comment_accessor():
    assert missing_field_with_items.optional_custom_comment() is None

def test_on_missing_field_with_items_registers_a_required_custom_comment_accessor():
    with pytest.raises(ValidationError) as excinfo:
        assert missing_field_with_items.required_custom_comment()

def test_on_missing_field_with_items_registers_a_custom_key_accessor():
    with pytest.raises(ValidationError) as excinfo:
        assert missing_field_with_items.custom_key()

def test_on_missing_field_with_items_registers_an_optional_custom_values_accessor():
    assert missing_field_with_items.optional_custom_values() == []

def test_on_missing_field_with_items_registers_a_required_custom_values_accessor():
    assert missing_field_with_items.required_custom_values() == []

# on missing section

def test_on_missing_section_registers_an_optional_custom_comment_accessor():
    assert missing_section.optional_custom_comment() is None

def test_on_missing_section_registers_a_required_custom_comment_accessor():
    with pytest.raises(ValidationError) as excinfo:
        assert missing_section.required_custom_comment()

def test_on_missing_section_registers_a_custom_key_accessor():
    with pytest.raises(ValidationError) as excinfo:
        assert missing_section.custom_key()
