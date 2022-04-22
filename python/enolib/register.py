from .elements.element_base import ElementBase
from .elements.field import Field
from .elements.missing.missing_element_base import MissingElementBase
from .elements.missing.missing_field import MissingField
from .elements.missing.missing_value_element_base import MissingValueElementBase
from .elements.value_element_base import ValueElementBase


def _register(name: str, function):
    if name == 'string':
        raise ValueError("You cannot register 'string' as a type/loader with enolib as this conflicts with the native string type accessors.")

    setattr(ElementBase, f"{name}_key", lambda self: self.key(function))
    setattr(ElementBase, f"optional_{name}_comment",  lambda self: self.optional_comment(function))
    setattr(ElementBase, f"required_{name}_comment",  lambda self: self.required_comment(function))
    setattr(ValueElementBase, f"optional_{name}_value", lambda self: self.optional_value(function))
    setattr(ValueElementBase, f"required_{name}_value", lambda self: self.required_value(function))
    setattr(Field, f"optional_{name}_values", lambda self: self.optional_values(function))
    setattr(Field, f"required_{name}_values", lambda self: self.required_values(function))
    setattr(MissingElementBase, f"{name}_key", MissingElementBase.string_key)
    setattr(MissingElementBase, f"optional_{name}_comment", MissingElementBase.optional_string_comment)
    setattr(MissingElementBase, f"required_{name}_comment", MissingElementBase.required_string_comment)
    setattr(MissingValueElementBase, f"optional_{name}_value", MissingValueElementBase.optional_string_value)
    setattr(MissingValueElementBase, f"required_{name}_value", MissingValueElementBase.required_string_value)
    setattr(MissingField, f"optional_{name}_values", MissingField.optional_string_values)
    setattr(MissingField, f"required_{name}_values", MissingField.required_string_values)

def register(*definitions_list, **definitions_dict):
    for definition in definitions_list:
        if callable(definition):
            _register(definition.__name__, definition)
        else:
            for name, function in definition.items():
                _register(name, function)

    for name, function in definitions_dict.items():
        _register(name, function)
