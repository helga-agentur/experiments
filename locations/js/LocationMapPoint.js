class LocationMapPoint extends HTMLElement{

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
        this.setupClickListeners();
        this.registerElement();
    }

    /**
     * Send registerlocationdisplay event when added to DOM. 
     */
    async registerElement() {
        this.dispatchEvent(new CustomEvent('registerlocationdisplay', { bubbles: true }));
        console.log('LocationMapPoint: Send register event');
    }

    /**
     * Method that is called by location component after this component was registered via
     * registerlocationdisplay event. Good enough for this one-time implementation. A nicer solution
     * would be to use e.g. a shared model and a (generic) setModel method.
     */
    updateLocation(locationName) {
        console.log('LocationMapPoint: Location updated to %s', locationName);
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
            console.warn('LocationMapPoint: Element %o is missing data-location attribute value', this);
        };
        console.log('LocationMapPoint: Identifier is %s', this.#identifier)
        return identifier;
    }

    /**
     * Listens to clicks on map points
     */
    setupClickListeners() {
        this.addEventListener('click', this.handleLocationClick.bind(this));
    }

    /**
     * Handles clicks on map points
     * @param {string}    Name of the user-selected location
     */
    handleLocationClick(locationName) {
        const eventOptions = { bubbles: true, detail: { locationName: this.#identifier }};
        this.dispatchEvent(new CustomEvent('locationchange', eventOptions));
        console.log('LocationMapPoint: dispatched event locationchange with %o', eventOptions);
    }

}

window.customElements.define('location-map-point', LocationMapPoint);