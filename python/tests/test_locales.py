import inspect
from enolib.locales import de, en, es

def test_message_locales_outside_default_en_locale():
    for locale in [de, en, es]:
        for key, translation in locale.__dict__.items():
            if key.startswith('__'):
                continue

            if callable(translation):
                parameters = ['PLACEHOLDER'] * len(inspect.signature(translation).parameters)
                result = translation(*parameters)
                assert isinstance(result, str)
            else:
                assert isinstance(translation, str)
