// TODO: Add additional data points to unpacking - line, line ranges etc. and expand public API for this if not available yet

function unpackComment(element, target) {
    const comment = element.optionalStringComment();
    
    if (comment) {
        target.comment = comment;
    }
}

function unpackValue(element, target) {
    const value = element.optionalStringValue();
    
    if (value) {
        target.value = value;
    }
}

function unpackSection(section) {
    const sectionUnpacked = {
        key: section.stringKey(),
        type: 'section'
    };
    
    unpackComment(section, sectionUnpacked);
                            
    const elements = section.elements();
    
    if (elements.length > 0) {
        sectionUnpacked.elements = section.elements().map(element => {
            if (element.isSection())
                return unpackSection(element);
            
            const elementUnpacked = { key: element.stringKey() };
                
            unpackComment(element, elementUnpacked);
            
            if (element.isEmbed()) {
                elementUnpacked.type = 'embed';
                
                unpackValue(element, elementUnpacked);
            } else if (element.isField()) {
                elementUnpacked.type = 'field';
                
                if (element.hasAttributes()) {
                    elementUnpacked.attributes = element.attributes().map(attribute => {
                        const attributeUnpacked = { key: attribute.stringKey() };
                        
                        unpackComment(attribute, attributeUnpacked);
                        unpackValue(attribute, attributeUnpacked);
                        
                        return attributeUnpacked;
                    });
                } else if (element.hasItems()) {
                    elementUnpacked.items = element.items().map(item => {
                        const itemUnpacked = {};
                        
                        unpackComment(item, itemUnpacked);
                        unpackValue(item, itemUnpacked);
                        
                        return itemUnpacked;
                    });
                } else if (element.hasValue()) {
                    unpackValue(element, elementUnpacked);
                }
            } else /* if (element.isFlag()) */ {
                elementUnpacked.type = 'flag';
            }
            
            return elementUnpacked;
        });
    }
    
    
    return sectionUnpacked;
}

export function unpack(document) {
    return unpackSection(document);
}