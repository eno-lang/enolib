import enolib
from tests.util import snapshot

input = """
Field: Value
\\ Spaced continuation
| Direct continuation

Field with attribute:
Attribute = Value
\\ Spaced continuation
| Direct continuation

Field with item:
- Value
\\ Spaced continuation
| Direct continuation

Field:
\\ Spaced continuation
| Direct continuation

Field with attribute:
Attribute =
\\ Spaced continuation
| Direct continuation

Field with item:
-
\\ Spaced continuation
| Direct continuation
""".strip()

def unpack_comment(element, target):
    comment = element.optional_string_comment()
    if comment:
        target['comment'] = comment
        
def unpack_value(element, target):
    value = element.optional_string_value()
    if value:
        target['value'] = value

def unpack_section(section):
    section_unpacked = {
        'elements': [],
        'type': 'document' if section.is_document() else 'section'
    }
    
    unpack_comment(section, section_unpacked)
    
    for element in section.elements():
        if element.is_section():
            section_unpacked['elements'].append(unpack_section(element))
        else:
            unpacked_element = { 'key': element.string_key() }
            
            unpack_comment(element, unpacked_element)
            
            if element.is_embed():
                unpacked_element['type'] = 'embed'
                unpack_value(element, unpacked)
            elif element.is_field():
                unpacked_element['type'] = 'field'
                if element.has_attributes():
                    unpacked_element['attributes'] = []
                    for attribute in element.attributes():
                        unpacked_attribute = { 'key': attribute.string_key(), 'type': 'attribute' }
                        unpack_comment(attribute, unpacked_attribute)
                        unpack_value(attribute, unpacked_attribute)
                        unpacked_element['attributes'].append(unpacked_attribute)
                elif element.has_items():
                    unpacked_element['items'] = []
                    for item in element.items():
                        unpacked_item = { 'type': 'item' }
                        unpack_comment(item, unpacked_item)
                        unpack_value(item, unpacked_item)
                        unpacked_element['items'].append(unpacked_item)    
                else:
                    unpack_value(element, unpacked_element)
            elif element.is_flag():
                unpacked_element['type'] = 'flag'
            
            section_unpacked['elements'].append(unpacked_element)
        
    return section_unpacked

def test_blackbox_test_continuations():
    document = enolib.parse(input)
    document_unpacked = unpack_section(document)

    assert document_unpacked == snapshot(document_unpacked, 'tests/blackbox/snapshots/continuations.snap.json')
