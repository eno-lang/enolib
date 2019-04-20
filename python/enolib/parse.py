from .context import Context
from .elements.section import Section

def parse(input: str, **options):
    context = Context(input, **options)

    return Section(context, context.document)
