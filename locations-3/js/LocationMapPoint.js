import { createObserver } from './createObserver.js';

class LocationMapPoint extends HTMLElement{
    
    #identifier = null;

    constructor() {
        super();
        this.#identifier = this.dataset.location;
        Object.assign(this, createObserver(['updateLocation']));
    }
    
    connectedCallback() {
        this.register();
        this.setupClickListeners();
    }

    /**
     * Method that is called by location component after this component was registered via
     * registerlocationdisplay event. Good enough for this one-time implementation. A nicer solution
     * would be to use e.g. a shared model and a (generic) setModel method.
     */
    update(type, { locationName }) {
        const method = this.#identifier === locationName ? 'add' : 'remove';
        requestAnimationFrame(() => this.classList[method]('is-selected'));
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
        this.dispatchEvent(new CustomEvent('updateLocation', eventOptions));
    }

}

window.customElements.define('location-map-point', LocationMapPoint);