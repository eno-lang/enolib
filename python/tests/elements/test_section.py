import enolib
import pytest

section = enolib.parse('')

lookup_input = '''
color: cyan
close:up
# notes

-- long
is
-- long
'''.lstrip()

def test_elements_touches_the_section():
    virgin_section = enolib.parse('')
    virgin_section.elements()

    assert hasattr(virgin_section, '_touched')

def test_elements_returns_the_elements_of_the_section():
    assert section.elements() == []

def test_all_elements_required_sets_all_elements_required_property_true():
    virgin_section = enolib.parse('')
    virgin_section.all_elements_required()

    assert virgin_section._all_elements_required is True

def test_all_elements_required_passing_true_sets_all_elements_required_property_true():
    virgin_section = enolib.parse('')
    virgin_section.all_elements_required(True)

    assert virgin_section._all_elements_required is True

def test_all_elements_required_passing_false_sets_all_elements_required_property_false():
    virgin_section = enolib.parse('')
    virgin_section.all_elements_required(True)
    virgin_section.all_elements_required(False)

    assert virgin_section._all_elements_required is False

def test_repr_returns_a_debug_representation():
    assert repr(section) == '<class Section document elements=0>'

def test_lookup_3(): # 'o'
    lookup = enolib.lookup(lookup_input, index=3)

    assert lookup['element'].string_key() == 'color'
    assert lookup['range'] == 'key'

def test_lookup_0_3(): # 'o'
    lookup = enolib.lookup(lookup_input, line=0, column=3)

    assert lookup['element'].string_key() == 'color'
    assert lookup['range'] == 'key'

def test_lookup_6(): # ' '
    lookup = enolib.lookup(lookup_input, index=6)

    assert lookup['element'].string_key() == 'color'
    assert lookup['range'] == 'field_operator'

def test_lookup_0_6(): # ' '
    lookup = enolib.lookup(lookup_input, line=0, column=6)

    assert lookup['element'].string_key() == 'color'
    assert lookup['range'] == 'field_operator'

def test_lookup_7(): # 'c'
    lookup = enolib.lookup(lookup_input, index=7)

    assert lookup['element'].string_key() == 'color'
    assert lookup['range'] == 'value'

def test_lookup_0_7(): # 'c'
    lookup = enolib.lookup(lookup_input, line=0, column=7)

    assert lookup['element'].string_key() == 'color'
    assert lookup['range'] == 'value'

def test_lookup_18(): # 'u'
    lookup = enolib.lookup(lookup_input, index=18)

    assert lookup['element'].string_key() == 'close'
    assert lookup['range'] == 'value'

def test_lookup_1_6(): # 'u'
    lookup = enolib.lookup(lookup_input, line=1, column=6)

    assert lookup['element'].string_key() == 'close'
    assert lookup['range'] == 'value'

def test_lookup_21(): # '#'
    lookup = enolib.lookup(lookup_input, index=21)

    assert lookup['element'].string_key() == 'notes'
    assert lookup['range'] == 'section_operator'

def test_lookup_2_0(): # '#'
    lookup = enolib.lookup(lookup_input, line=2, column=0)

    assert lookup['element'].string_key() == 'notes'
    assert lookup['range'] == 'section_operator'

def test_lookup_27(): # 's'
    lookup = enolib.lookup(lookup_input, index=27)

    assert lookup['element'].string_key() == 'notes'
    assert lookup['range'] == 'key'

def test_lookup_2_6(): # 's'
    lookup = enolib.lookup(lookup_input, line=2, column=6)

    assert lookup['element'].string_key() == 'notes'
    assert lookup['range'] == 'key'

def test_lookup_29(): # begin of empty line
    lookup = enolib.lookup(lookup_input, index=29)

    assert lookup['element'].string_key() == 'notes'
    assert lookup['range'] == None

def test_lookup_3_0(): # begin of empty line
    lookup = enolib.lookup(lookup_input, line=3, column=0)

    assert lookup['element'].string_key() == 'notes'
    assert lookup['range'] == None

def test_lookup_38(): # '38'
    lookup = enolib.lookup(lookup_input, index=38)

    assert lookup['element'].string_key() == 'long'
    assert lookup['range'] == 'value'

def test_lookup_5_0(): # 'i'
    lookup = enolib.lookup(lookup_input, line=5, column=0)

    assert lookup['element'].string_key() == 'long'
    assert lookup['range'] == 'value'

def test_lookup_46(): # 'n'
    lookup = enolib.lookup(lookup_input, index=46)

    assert lookup['element'].string_key() == 'long'
    assert lookup['range'] == 'key'

def test_lookup_6_5(): # 'n'
    lookup = enolib.lookup(lookup_input, line=6, column=5)

    assert lookup['element'].string_key() == 'long'
    assert lookup['range'] == 'key'

def test_lookup_999(): # out of bounds
    with pytest.raises(IndexError) as excinfo:
        enolib.lookup(lookup_input, index=999)

    assert str(excinfo.value) == "You are trying to look up an index (999) outside of the document's index range (0-49)"

# TODO: Here and in other impl. - specs for out of bounds on a valid line

def test_lookup_999_999(): # out of bounds
    with pytest.raises(IndexError) as excinfo:
        lookup = enolib.lookup(lookup_input, line=999, column=999)

    assert str(excinfo.value) == "You are trying to look up a line (999) outside of the document's line range (0-7)"
