import { createObservable } from './createObserver.js';
import { eventName } from './eventConfig.js';

class LocationComponent extends HTMLElement{

    constructor() {
        super();
        Object.assign(this, createObservable([eventName]));
        this.listen();
    }

    // Optional and just a test – we could do anything here
    modifyData(type, data) {
        return data;
    }

}

window.customElements.define('location-component', LocationComponent);