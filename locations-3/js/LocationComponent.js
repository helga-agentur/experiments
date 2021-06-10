import { createObservable } from './createObserver.js';
import { eventName } from './eventConfig.js';

class LocationComponent extends HTMLElement{

    constructor() {
        super();
        Object.assign(
            this,
            createObservable({
                observerTypes: [eventName],
                modifyEventData: (type, data) => data,
            }),
        );
        this.listen();
    }

}

window.customElements.define('location-component', LocationComponent);

