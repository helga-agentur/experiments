import { createObserver } from './createObserver.js';
import { eventName } from './eventConfig.js';

class LocationMapPoint extends HTMLElement{
    
    #identifier = null;

    constructor() {
        super();
        Object.assign(
            this,
            createObserver({ observerTypes: [eventName], updateFunction: this.render.bind(this) }),
        );
        this.#identifier = this.dataset.location;
    }
    
    connectedCallback() {
        this.register();
        this.setupClickListeners();
    }

    render(type, { locationName }) {
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