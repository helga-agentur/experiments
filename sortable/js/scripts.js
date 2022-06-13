const readAttribute = (
    element,
    attributeName,
    {
        transform =(value) => value,
        validate = () => true,
        expectation,
    } = {},
) => {
    const value = element.getAttribute(attributeName);
    const transformedValue = transform(value);
    if (!validate(transformedValue)) {
        throw new Error(`Expected attribute ${attributeName} of element ${element} to be ${expectation}; got ${transformedValue} instead (${value} before the transform function was applied).`);
    }
    return transformedValue;
}

/**
 * Button that executes a sort on a SortableList by dispatching a sortList event that contains
 * all relevant data (sort order and identifier of the SortableList as there might be more than
 * one of those on a page).
 * *
 * Attributes:
 * - data-sort-by {String}              Property the SortableList should be sorted by
 * - data-sortable-identifier {String}  Identifier of the SortableList that should be 
 *                                      sorted when the button is pressed.
 */
class SortButton extends HTMLElement {
    connectedCallback() {
        this.setupClickListener();
    }

    setupClickListener() {
        this.addEventListener('click', this.emitSortEvent.bind(this));
    }

    emitSortEvent() {
        const event = new CustomEvent('sortList', {
            bubbles: true,
            detail: {
                sortBy: readAttribute(
                    this,
                    'data-sort-by',
                    { validate: value => !!value, expectation: 'a non-empty string' },
                ),
                sortableIdentifier: readAttribute(
                    this, 
                    'data-sortable-identifier',
                    { validate: value => !!value, expectation: 'a non-empty string' },
                )
            },
        });
        this.dispatchEvent(event);
    }
}

if (!window.customElements.get('sort-button')) {
    window.customElements.define('sort-button', SortButton);
}




/**
 * Component that sorts a list (via order CSS property) when a sortList event is caught on window
 * (probably dispatched by SortButton).
 * IMPORTANT: The sort order is set by the order CSS property on the sortable elements; it is
 * therefore necessary that the sortable items are flex or grid items.
 *
 * Attributes:
 * - data-sortable-identifier {String}      Identifier of the SortableList that should be 
 *                                          sorted when the corresponding button is pressed.
 *                                          Must match attribute of the same name of all
 *                                          SortButtons that should sort this list.
 * - data-sortable-items-selector {String}  Selector for all items that should be sorted
 *                                          within the component.
 * 
 * Usage: 
 * - Create as many SortButtons as there are properties to sort by
 * - Create SortableList and wrap it around the items that should be sorted
 * - Add property data-{fieldName}="{value}" to all items that should be sortable within
 *   SortableList
 */
 class SortableList extends HTMLElement {
    connectedCallback() {
        this.setupSortListListener();
    }

    setupSortListListener() {
        window.addEventListener('sortList', this.handleSortListEvent.bind(this));
    }

    handleSortListEvent(event) {
        const sortableIdentifier = readAttribute(
            this,
            'data-sortable-identifier',
            { validate: value => !!value, expectation: 'a non-empty string' },
        )
        if (event?.detail?.sortableIdentifier !== sortableIdentifier) return;
        const sortFieldName = event?.detail?.sortBy;
        if (!sortFieldName) {
            throw new Error(`SortableList: sortList event fired does not contain a sortBy property in details which are ${JSON.stringify(event.details)}`);
        }
        this.sortSortableItemsBy(sortFieldName);
    }

    getSortableItems() {
        const sortableItemsSelector = readAttribute(
            this,
            'data-sortable-items-selector',
            { validate: value => !!value, expectation: 'a non-empty string' },
        );
        const items = this.querySelectorAll(sortableItemsSelector);
        if (!items.length) {
            console.warn(`SortableList: No sortable items found with selector ${sortableItemsSelector} within custom element.`);
        }
        return Array.from(items);
    }

    sortSortableItemsBy(sortFieldName) {
        // Return an array of functions that, when executd, will update the DOM to reflect the new
        // sort order. This allows us to only call rAF once.
        const updateFunctions = this.getSortableItems()
            .map((element) => ({
                value: readAttribute(element, `data-${sortFieldName}`),
                element,
            }))
            .sort((a, b) => a.value - b.value)
            .map((item, index) => () => item.element.style.order = index);
        window.requestAnimationFrame(() => updateFunctions.forEach(fn => fn()))
    }
}

if (!window.customElements.get('sortable-list')) {
    window.customElements.define('sortable-list', SortableList);
}
