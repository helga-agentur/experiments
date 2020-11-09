const canBeIdentical = element => element.dataset.preserveId !== undefined;
const findIdentical = (parent, element) => parent.querySelector(`:scope > [data-preserve-id="${element.dataset.preserveId}"]`);


const compareDocument = (original, update) => {
    const body = compareNodeContent(original.querySelector('body'), update.querySelector('body'));
    const head = compareNodeContent(original.querySelector('head'), update.querySelector('head'));
}


const compareNodeContent = (originalNode, updateNode) => {
    const identicals = findIdentical(originalNode, updateNode);
    // Remove everything from 
}

/**
 * Returns identical elements of two nodes in the order they appear in update. 
 * Uses two functions to determine identity:
 * - canBeIdentical (performance optimization)
 * - findIdentical (returns identical that is the child of the provided DOM node)
 */
const findIdenticals = (original, update) => {
    const possibleOriginalIdenticals = Array.from(update.children()).filter((child) => (
        canBeIdentical(chidl)
    ));
    const identicals = possibleOriginalIdenticals
        .map(element => [element, findIdentical(original, element)])
        .filter(identicals => identicals.length === 2);
    return identicals;
}










{
    element: el,
    operation: 'add',
    after: el, // let's assume we don't insert anything beore <html>; might use undefined in those cases
}
{
    element: el,
    operation: 'remove',
}
{
    element: el,
    operation: 'addAttribute', // or removeAttribute or updateAttribute
    attributeName: 'name',
    attributeValue: 'value',
}
{
    element: el,
    operation: 'move',
    after: el,
}

old:
<body> // html, body, head always stay
<div data-preserve-id="header" class="oldtest"></div>
<div>Old</div>
</body>

new:
<body>
<div>Test</div>
<div data-preserve-id="header" class="test"></div>
</body>


// For usage with deep-diff
{ 
    element: 'div', // either element/attributes OR text
    text: 'this is a text',
    attributes: {
        class: 'test',
    },
    children: [
        … same
    ]
}


{
    element: div.test,
    operation: 'add',
    after: body // or in? And after is always the order? (but difficult with preserved elements)
}
{
    element: div#header
    operation: 'move',
    relatedElement: div.test
    manipulation: append | insert,
}
{
    element: div#header
    operation: 'addAttribute',
    attributeName: 'name',
    attributeValue: 'value',
}
{
    element: div.old
    operation: 'remove',
}
{
    element: div[dataIdPreserve]
    operation: 'ignore',
    originalElement: document div[dataIdPreserve],
}




// Remove non-preserved elements
// Get preserved elements on old/new DOM
// Remove only-old preserves
// Update order of preserves, add new ones

// Add new non-preserved 
// Re-create scripts

