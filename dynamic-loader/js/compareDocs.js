const canBeIdentical = element => element.dataset.preserveId !== undefined;
const findIdentical = (parent, element) => parent.querySelector(`:scope > [data-preserve-id="${element.dataset.preserveId}"]`);


const compareDocument = (original, update) => {
    console.log('compare', original, update);
    compareNodeContent(original.querySelector('body'), update.querySelector('body'));
    compareNodeContent(original.querySelector('head'), update.querySelector('head'));
}


const compareNodeContent = (originalNode, updateNode) => {
    const identicals = findIdenticals(originalNode, updateNode);
    console.log('identicals', identicals);
    
    // Remove everything from original that is not preserved
    const originalIdenticals = identicals.map(([update, original]) => original);
    Array.from(originalNode.children).forEach((child) => {
        if (!originalIdenticals.includes(child)) originalNode.removeChild(child);
    });

    // Insert updated nodes in their order one by one into the DOM. When an element is preserved,
    // use the original instead of the updated element.
    const preservedMapping = new Map(identicals);
    Array.from(updateNode.children).forEach((element) => {
        const elementToAppend = preservedMapping.get(element) || element;
        // TBD: Callback/hook to update node
        const updatedElementToAppend = changeNode(elementToAppend);

        // Try not to place link at a different position; removing from and adding it to DOM will
        // cause a flicker
        if (element.tagName.toLowerCase() === 'link' && preservedMapping.has(element)) {
            console.log('Ignore link %o', element);
            return;
        }

        console.log('updated node', updatedElementToAppend);
        originalNode.append(updatedElementToAppend);
    });

}


const changeNode = (node) => {
    // Scripts must be created through createElement and cannot be added to DOM via innerHTML
    // (that we use on DocumentFragment) – or they will not execute.
    if (node.tagName.toLowerCase() === 'script') {
        const script = document.createElement('script');
        for (const attribute of node.attributes) {
            script.setAttribute(attribute.name, attribute.value);
        }
        console.log('Created script', script);
        return script;
    }
    return node;
}


/**
 * Returns identical elements of two nodes in the order they appear in update. 
 * Uses two functions to determine identity:
 * - canBeIdentical (performance optimization)
 * - findIdentical (returns identical that is the child of the provided DOM node)
 * @returns Array.<HTMLElement, HTMLElement>[]  Array with one entry per identical; entry consists
 *                                              of an array with update and original element
 */
const findIdenticals = (original, update) => {
    console.log('findIdenticals for', original, update);
    const possibleUpdateIdenticals = Array.from(update.children).filter((child) => (
        canBeIdentical(child)
    ));
    console.log('possible identicals', possibleUpdateIdenticals);
    const identicals = possibleUpdateIdenticals
        .map(element => [element, findIdentical(original, element)])
        .filter(identicals => identicals.length === 2);
    return identicals;
}

export default compareDocument;