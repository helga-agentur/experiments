import { createObserver } from './createObserver.js';
import { eventName } from './eventConfig.js';

class LocationSelect extends HTMLElement{

    #select = null;

    constructor() {
        super();
        Object.assign(
            this,
            createObserver({ observerTypes: [eventName], updateFunction: this.update.bind(this) }),
        );
    }
    
    connectedCallback() {
        this.#select = this.querySelector('select');
        this.register();
        this.getDefaultValue();
        this.setupChangeListeners();
    }

    getDefaultValue() {
        const { value } = this.#select;
        if (value) this.handleLocationChange(value);
    }

    update(type, { locationName }) {
        this.#select.value = locationName;
    }

    setupChangeListeners() {
        this.addEventListener('change', this.handleLocationChange.bind(this));
    }

    handleLocationChange(locationName) {
        const eventOptions = { bubbles: true, detail: { locationName: this.#select.value }};
        this.dispatchEvent(new CustomEvent(eventName, eventOptions));
    }

}

window.customElements.define('location-select', LocationSelect);