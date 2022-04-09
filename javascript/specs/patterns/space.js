const spacingVariants = tokens => {
    if (tokens.length === 1)
        return [tokens[0], `   ${tokens[0]}`];
        
    const variants = [];
    for (const variant of spacingVariants(tokens.slice(1))) {
        variants.push(`${tokens[0]}${variant}`);
        variants.push(`   ${tokens[0]}${variant}`);
    }
    return variants;
};

export function space(...tokens) {
    tokens.push('');
    
    return spacingVariants(tokens).filter((variant, index, variants) => variants.indexOf(variant) === index);
}
