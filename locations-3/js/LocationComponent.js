import { createObservable } from './createObserver.js';

class LocationComponent extends HTMLElement{

    constructor() {
        super();
        Object.assign(this, createObservable(['updateLocation']));
        this.listen();
    }

    // Optional and just a test – we could do anything here
    modifyData(type, data) {
        return data;
    }

}

window.customElements.define('location-component', LocationComponent);