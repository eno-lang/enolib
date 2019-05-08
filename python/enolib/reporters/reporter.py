from ..constants import (
    DOCUMENT,
    FIELD,
    FIELDSET,
    FIELDSET_ENTRY,
    LIST,
    LIST_ITEM,
    MULTILINE_FIELD_BEGIN,
    SECTION
)

DISPLAY = 'Display Line'
EMPHASIZE = 'Emphasize Line'
INDICATE = 'Indicate Line'
OMISSION = 'Insert Omission'
QUESTION = 'Question Line'

class Reporter:
    def __init__(self, context):
        self._context = context
        self._index = [None] * self._context.line_count
        self._snippet = [None] * self._context.line_count

        self._build_index()

    def _build_index(self):
        # TODO: Put this into the root class scope?
        def index_comments(element):
            if 'comments' in element:
                for comment in element['comments']:
                    self._index[comment['line']] = comment

        # TODO: Put this into the root class scope?
        def traverse(section):
            for element in section['elements']:
                index_comments(element)

                self._index[element['line']] = element

                if element['type'] == SECTION:
                    traverse(element)
                elif element['type'] == FIELD:
                    if 'continuations' in element:
                        for continuation in element['continuations']:
                            self._index[continuation['line']] = continuation
                elif element['type'] == MULTILINE_FIELD_BEGIN:
                    # Missing when reporting an unterminated multiline field
                    if 'end' in element:
                        self._index[element['end']['line']] = element['end']

                    if 'lines' in element:
                        for line in element['lines']:
                            self._index[line['line']] = line

                elif element['type'] == LIST:
                    if 'items' in element:
                        for item in element['items']:
                            index_comments(item)

                            self._index[item['line']] = item

                            if 'continuations' in item:
                                for continuation in item['continuations']:
                                    self._index[continuation['line']] = continuation

                elif element['type'] == FIELDSET:
                    if 'entries' in element:
                        for entry in element['entries']:
                            index_comments(entry)

                            self._index[entry['line']] = entry

                            if 'continuations' in entry:
                                for continuation in entry['continuations']:
                                    self._index[continuation['line']] = continuation

        traverse(self._context.document)

        for meta in self._context.meta:
            self._index[meta['line']] = meta

    def _tag_continuations(self, element, tag):
        scan_line = element['line'] + 1

        if not 'continuations' in element:
            return scan_line

        for continuation in element['continuations']:
            while scan_line < continuation['line']:
                self._snippet[scan_line] = tag
                scan_line += 1

            self._snippet[continuation['line']] = tag
            scan_line += 1

        return scan_line

    def _tag_continuables(self, element, collection, tag):
        scan_line = element['line'] + 1

        if not collection in element:
            return scan_line

        for continuable in element[collection]:
            while scan_line < continuable['line']:
                self._snippet[scan_line] = tag
                scan_line += 1

            self._snippet[continuable['line']] = tag

            scan_line = self._tag_continuations(continuable, tag)

        return scan_line

    def _tag_children(self, element, tag):
        if element['type'] == FIELD or element['type'] == LIST_ITEM or element['type'] == FIELDSET_ENTRY:
            return self._tag_continuations(element, tag)
        elif element['type'] == LIST:
            return self._tag_continuables(element, 'items', tag)
        elif element['type'] == FIELDSET and 'entries' in element:
            return self._tag_continuables(element, 'entries', tag)
        elif element['type'] == MULTILINE_FIELD_BEGIN:
            if 'lines' in element:
                for line in element['lines']:
                    self._snippet[line['line']] = tag

            if 'end' in element:
                self._snippet[element['end']['line']] = tag
                return element['end']['line'] + 1
            elif 'lines' in element:
                return element['lines'][-1]['line'] + 1
            else:
                return element['line'] + 1
        elif element['type'] == SECTION:
            return self._tag_section(element, tag)

    def _tag_section(self, section, tag, recursive=True):
        scan_line = section['line'] + 1

        for element in section['elements']:
            while scan_line < element['line']:
                self._snippet[scan_line] = tag
                scan_line += 1

            if not recursive and element['type'] == SECTION:
                break

            self._snippet[element['line']] = tag

            scan_line = self._tag_children(element, tag)

        return scan_line

    def indicate_line(self, element):
        self._snippet[element['line']] = INDICATE
        return self

    def question_line(self, element):
        self._snippet[element['line']] = QUESTION
        return self

    def report_comments(self, element):
        self._snippet[element['line']] = INDICATE
        for comment in element['comments']:
            self._snippet[comment['line']] = EMPHASIZE

        return self

    def report_element(self, element):
        self._snippet[element['line']] = EMPHASIZE
        self._tag_children(element, INDICATE)

        return self

    def report_elements(self, elements):
        for element in elements:
            self._snippet[element['line']] = EMPHASIZE
            self._tag_children(element, INDICATE)

        return self

    def report_line(self, instruction):
        self._snippet[instruction['line']] = EMPHASIZE

        return self

    def report_multiline_value(self, element):
        for line in element['lines']:
            self._snippet[line['line']] = EMPHASIZE

        return self

    def report_missing_element(self, parent):
        if parent['type'] != DOCUMENT:
            self._snippet[parent['line']] = INDICATE

        if parent['type'] == SECTION:
            self._tag_section(parent, QUESTION, False)
        else:
            self._tag_children(parent, QUESTION)

        return self

    def snippet(self):
        if all(tag is None for tag in self._snippet):
            for line in range(len(self._snippet)):
                self._snippet[line] = QUESTION
        else:
            # TODO: Possibly better algorithm for this

            for line, tag in enumerate(self._snippet):
                if tag is not None:
                    continue

                if(line + 2 < self._context.line_count and self._snippet[line + 2] is not None and self._snippet[line + 2] != DISPLAY or
                   line - 2 > 0 and self._snippet[line - 2] is not None and self._snippet[line - 2] != DISPLAY or
                   line + 1 < self._context.line_count and self._snippet[line + 1] is not None and self._snippet[line + 1] != DISPLAY or
                   line - 1 > 0 and self._snippet[line - 1] is not None and self._snippet[line - 1] != DISPLAY):
                    self._snippet[line] = DISPLAY
                elif line + 3 < self._context.line_count and self._snippet[line + 3] is not None and self._snippet[line + 3] != DISPLAY:
                    self._snippet[line] = OMISSION

            if self._snippet[-1] is None:
                self._snippet[-1] = OMISSION

        return self._print()
