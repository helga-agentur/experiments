import LocationBase from './LocationBase.js';

class LocationSelect extends LocationBase {

    /**
     * Use an empty select element as default to prevent unnecessary errors
    */
    #select = document.createElement('select');

    connectedCallback() {
        super.connectedCallback();
        this.#select = this.getSelect();
        this.getDefaultValue();
        this.setupChangeListeners();
    }

    /**
     * Gets the default (initial) value from DOM select element
     */
    getDefaultValue() {
        const { value } = this.#select;
        if (value) this.handleLocationChange(value);
    }

    getSelect() {
        const select = this.querySelector('select');
        if (!select) {
            throw new Error('LocationSelect: Could not find select HTML element within %o', this);
        }
        return select;
    }

    update(locationName) {
        requestAnimationFrame(() => this.#select.value = locationName);
    }

    setupChangeListeners() {
        this.addEventListener('change', this.handleLocationChange.bind(this));
    }

    handleLocationChange(locationName) {
        const eventOptions = { bubbles: true, detail: { locationName: this.#select.value }};
        this.dispatchEvent(new CustomEvent('locationchange', eventOptions));
        console.log('LocationSelect: dispatched event locationchange with %o', eventOptions);
    }

}

window.customElements.define('location-select', LocationSelect);