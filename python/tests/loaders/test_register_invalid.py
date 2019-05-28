import enolib
import pytest

def test_trying_to_register_string_throws_an_error():
    with pytest.raises(ValueError) as excinfo:
        enolib.register(string=lambda value: value)

    assert str(excinfo.value) == "You cannot register 'string' as a type/loader with enolib as this conflicts with the native string type accessors."
