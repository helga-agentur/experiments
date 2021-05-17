import { createObserver } from './createObserver.js';
import { eventName } from './eventConfig.js';

class LocationMapPoint extends HTMLElement{
    
    #identifier = null;

    constructor() {
        super();
        this.#identifier = this.dataset.location;
        Object.assign(this, createObserver([eventName]));
    }
    
    connectedCallback() {
        this.register();
        this.setupClickListeners();
    }

    update(type, { locationName }) {
        const method = this.#identifier === locationName ? 'add' : 'remove';
        requestAnimationFrame(() => this.classList[method]('is-selected'));
    }

    setupClickListeners() {
        this.addEventListener('click', this.handleLocationClick.bind(this));
    }

    handleLocationClick() {
        const eventOptions = { bubbles: true, detail: { locationName: this.#identifier }};
        this.dispatchEvent(new CustomEvent(eventName, eventOptions));
    }

}

window.customElements.define('location-map-point', LocationMapPoint);