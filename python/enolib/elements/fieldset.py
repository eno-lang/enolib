from ..errors.validation import Validation
from . import fieldset_entry
from . import section
from .element_base import ElementBase
from .missing import missing_fieldset_entry


class Fieldset(ElementBase):
    def __init__(self, context, instruction, parent=None):
        super().__init__(context, instruction, parent)

        self._all_entries_required = parent._all_elements_required if parent else False

    def __repr__(self):
        return f"<class Fieldset key={self._instruction['key']} entries={len(self._entries())}>"

    def _entries(self, as_map=False):
        if not hasattr(self, '_instantiated_entries'):
            self._instantiated_entries = []
            self._instantiated_entries_map = {}
            self._instantiate_entries(self._instruction)

        return self._instantiated_entries_map if as_map else self._instantiated_entries

    def _entry(self, key, *, required=False):
        self._touched = True

        if not key:
            entries = self._entries()
        else:
            entries_map = self._entries(True)
            entries = entries_map[key] if key in entries_map else []

        if len(entries) == 0:
            if required or self._all_entries_required:
                raise Validation.missing_element(self._context, key, self._instruction, 'missing_fieldset_entry')
            elif required is None:
                return missing_fieldset_entry.MissingFieldsetEntry(key, self)
            else:
                return None

        if len(entries) > 1:
            raise Validation.unexpected_multiple_elements(
                self._context,
                key,
                [e._instruction for e in entries],
                'expected_single_fieldset_entry'
            )

        return entries[0]

    def _instantiate_entries(self, fieldset):
        if 'mirror' in fieldset:
            self._instantiate_entries(fieldset['mirror'])
        elif 'entries' in fieldset:
            def instantiate_and_index(entry):
                instance = fieldset_entry.FieldsetEntry(self._context, entry, self)

                if entry['key'] in self._instantiated_entries_map:
                    self._instantiated_entries_map[entry['key']].append(instance)
                else:
                    self._instantiated_entries_map[entry['key']] = [instance]

                return instance

            filtered = [entry for entry in fieldset['entries'] if entry['key'] not in self._instantiated_entries_map]
            native_entries = [instantiate_and_index(entry) for entry in filtered]

            if 'extend' in fieldset:
                self._instantiate_entries(fieldset['extend'])

            self._instantiated_entries.extend(native_entries)

    def _missingError(self, entry):
        raise Validation.missing_element(self._context, entry._key, self._instruction, 'missing_fieldset_entry')

    def _untouched(self):
        if not hasattr(self, '_touched'):
            return self._instruction

        untouched_entry = next((entry for entry in self._entries() if not hasattr(entry, '_touched')), None)

        return untouched_entry._instruction if untouched_entry else False

    def all_entries_required(self, required=True):
        self._all_entries_required = required

    def assert_all_touched(self, message=None, *, only=None, skip=None):
        entries_map = self._entries(True)

        for key, entries in entries_map.items():
            if (skip and key in skip) or (only and key not in only):
                continue

            for entry in entries:
                if not hasattr(entry, '_touched'):
                    if callable(message):
                        message = message(entry)

                    raise Validation.unexpected_element(self._context, message, entry['instruction'])

    def entries(self, key=None):
        self._touched = True

        if not key:
            return self._entries()
        else:
            entries_map = self._entries(True)
            return entries_map[key] if key in entries_map else []

    def entry(self, key=None):
        return self._entry(key)

    def optional_entry(self, key=None):
        return self._entry(key, required=False)

    def parent(self):
        return self._parent or section.Section(self._context, self._instruction['parent'])

    def required_entry(self, key=None):
        return self._entry(key, required=True)

    def touch(self):
        self._touched = True

        for entry in self._entries():
            entry._touched = True
