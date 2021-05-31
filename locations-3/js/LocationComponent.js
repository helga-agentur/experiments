import { createObservable } from './createObserver.js';
import { eventName } from './eventConfig.js';

class LocationComponent extends HTMLElement{

    constructor() {
        super();
        const modifyData = (type, data) => data;
        Object.assign(
            this,
            createObservable({ observerTypes: [eventName], modifyEventData: data => data }),
        );
        this.listen();
    }

}

window.customElements.define('location-component', LocationComponent);

