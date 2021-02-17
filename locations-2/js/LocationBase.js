/**
 * Base class for child components of a LocationComponent:
 * - Dispatches (de)registerlocationelement on connected/disconnected
 * - Add locationchange event listener to window and call update method on child components if
 *   a relevant change happened
 */
export default class extends HTMLElement{
    
    constructor() {
        super();
        this.boundHandleLocationChangeEvent = this.handleLocationChangeEvent.bind(this);
    }

    connectedCallback() {
        window.addEventListener('locationchange', this.boundHandleLocationChangeEvent);
        this.dispatchEvent(new CustomEvent('registerlocationelement', { bubbles: true }));
    }

    disconnectedCallback() {
        window.removeEventListener('locationchange', this.boundHandleLocationChangeEvent);
        this.dispatchEvent(new CustomEvent('deregisterlocationelement', { bubbles: true }));
    }

    handleLocationChangeEvent(ev) {
        if (!ev.detail.targets.includes(this)) return;
        if (typeof this.update !== 'function') {
            throw new Error('Expected child component to provide an update method');
        }
        this.update(ev.detail.locationName);
    }

}
