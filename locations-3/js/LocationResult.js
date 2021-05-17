import { createObserver } from './createObserver.js';
import { eventName } from './eventConfig.js';

class LocationResult extends HTMLElement{

    #identifier = null;
    
    constructor() {
        super();
        Object.assign(this, createObserver([eventName]));
    }
    
    connectedCallback() {
        this.#identifier = this.getAttribute('data-location');
        this.register();
    }

    update(type, { locationName }) {
        const method = this.#identifier === locationName ? 'add' : 'remove';
        requestAnimationFrame(() => this.classList[method]('is-selected'));
    }

}

window.customElements.define('location-result', LocationResult);