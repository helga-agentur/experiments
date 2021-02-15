class LocationSelect extends HTMLElement{

    /**
     * Use dummy select as fallback (so that we don't have to use a lot of ifs everywhere
     * to test if select is not defined)
     * @type HTMLSelectElement
     */
    #select = document.createElement('select');

    constructor() {
        super();
        this.#select = this.getSelect();
    }
    
    connectedCallback() {
        this.getDefaultValue();
        this.setupChangeListeners();
        this.registerElement();
    }

    /**
     * Checks if select has a default value; if yes, propagates it
     */
    getDefaultValue() {
        const { value } = this.#select;
        if (value) this.handleLocationChange(value);
    }

    /**
     * Finds the select element in child DOM
     * @returns HTMLSelectElement
     */
    getSelect() {
        const select = this.querySelector('select');
        if (!select) {
            console.warn('LocationSelect: Could not find select HTML element within %o', this);
            return;
        }
        return select;
    }

    /**
     * Send registerlocationdisplay event when added to DOM. 
     */
    async registerElement() {
        this.dispatchEvent(new CustomEvent('registerlocationdisplay', { bubbles: true }));
        console.log('LocationSelect: Send register event');
    }

    /**
     * Method that is called by location component after this component was registered via
     * registerlocationdisplay event. Good enough for this one-time implementation. A nicer solution
     * would be to use e.g. a shared model and a (generic) setModel method.
     */
    updateLocation(locationName) {
        this.#select.value = locationName;
    }

    /**
     * Listens to change on select (it bubbles)
     */
    setupChangeListeners() {
        this.addEventListener('change', this.handleLocationChange.bind(this));
    }

    /**
     * Handles clicks on map points
     * @param {string}    Name of the user-selected location
     */
    handleLocationChange(locationName) {
        const eventOptions = { bubbles: true, detail: { locationName: this.#select.value }};
        this.dispatchEvent(new CustomEvent('locationchange', eventOptions));
        console.log('LocationSelect: dispatched event locationchange with %o', eventOptions);
    }

}

window.customElements.define('location-select', LocationSelect);