class LocationResult extends HTMLElement{

    /**
     * Holds the current location's identifier
     * @type string
     */
    #identifier = null;

    /**
     * Stores if current point is selected; needed to reduce DOM updates (only update DOM if current
     * isSelected state does not correspond with previous isSelected state)
     * @type boolean
    */
    #isSelected = false;

    /**
     * Make class name easily accessible and configurable through class property
     */
    #selectedClassName = 'is-selected';

    
    constructor() {
        super();
        this.#identifier = this.getIdentifier();
    }
    
    connectedCallback() {
        this.registerElement();
    }

    /**
     * Send registerlocationdisplay event when added to DOM. 
     */
    async registerElement() {
        this.dispatchEvent(new CustomEvent('registerlocationdisplay', { bubbles: true }));
        console.log('LocationResult: Send register event');
    }

    /**
     * Method that is called by location component after this component was registered via
     * registerlocationdisplay event. Good enough for this one-time implementation. A nicer solution
     * would be to use e.g. a shared model and a (generic) setModel method.
     */
    updateLocation(locationName) {
        console.log('LocationResult: Location updated to %s', locationName);
        if (locationName === this.#identifier && !this.#isSelected) {
            requestAnimationFrame(() => this.classList.add(this.#selectedClassName));
            this.#isSelected = true;
        }
        if (locationName !== this.#identifier && this.#isSelected) {
            requestAnimationFrame(() => this.classList.remove(this.#selectedClassName));
            this.#isSelected = false;
        }
    }

    /**
     * Gets the current location's identifier from DOM.
     * @returns {string}
     */
    getIdentifier() {
        const identifier = this.getAttribute('data-location');
        if (!identifier) {
            console.warn('LocationResult: Element %o is missing data-location attribute value', this);
        };
        console.log('LocationResult: Identifier is %s', this.#identifier)
        return identifier;
    }

}

window.customElements.define('location-result', LocationResult);