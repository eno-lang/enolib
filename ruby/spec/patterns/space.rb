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
def space(*tokens)
  spacing_variants(tokens + ['']).uniq
end

def spacing_variants(tokens)
  if tokens.length > 1
    results = []
    spacing_variants(tokens[1..-1]).each do |variant|
      results.push("#{tokens.first}#{variant}")
      results.push("   #{tokens.first}#{variant}")
    end
    results
  else
    [tokens.first, "   #{tokens.first}"]
  end
end
