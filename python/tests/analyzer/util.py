from enolib.context import Context

def analyze(input):
    context = Context(input)

    return {
        'document': context.document,
        'line_count': context.line_count,
        'meta': context.meta
    }
