import LocationBase from './LocationBase.js';

class LocationResult extends LocationBase {

    #identifier = null;
    #isSelected = false;
    #selectedClassName = 'is-selected';

    connectedCallback() {
        super.connectedCallback();
        this.#identifier = this.getIdentifier();
    }

    update(locationName) {
        console.log('LocationResult: Location updated to %s', locationName);
        const isSelected = locationName === this.#identifier;
        if (isSelected === this.#isSelected) return;
        const method = isSelected ? 'add' : 'remove';
        requestAnimationFrame(() => this.classList[method](this.#selectedClassName));
        this.#isSelected = isSelected;

    }

    getIdentifier() {
        return this.getAttribute('data-location');
    }

}

window.customElements.define('location-result', LocationResult);