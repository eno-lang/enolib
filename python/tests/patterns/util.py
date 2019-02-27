# For the biggest part the eno language specification
# allows arbitrary whitespace before, between and after tokens.
#
# This helper generates multiple spacing variants for any given
# set of tokens to ensure correct pattern matching for all spacing variants.
#
# E.g. for input space('A', B') generates these variants:
# "AB"
# "   AB"
# "A   B"
# "   A   B"
# "AB   "
# "   AB   "
# "A   B   "
# "   A   B   "
def spacing_variants(tokens):
  if len(tokens) > 1:
    results = []

    for variant in spacing_variants(tokens[1:]):
      results.append(f"{tokens[0]}{variant}")
      results.append(f"   {tokens[0]}{variant}")

    return results
  else:
    return [tokens[0], f"   {tokens[0]}"]

def space(*tokens):
  tokens = list(tokens)
  tokens.append('')

  return spacing_variants(tokens)
