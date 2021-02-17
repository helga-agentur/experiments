import LocationBase from './LocationBase.js';

class LocationMapPoint extends LocationBase{

    #identifier = null;
    #isSelected = false;
    #selectedClassName = 'is-selected';
    
    connectedCallback() {
        super.connectedCallback();
        this.#identifier = this.getIdentifier();
        this.setupClickListeners();
    }

    update(locationName) {
        console.log('LocationMapPoint: Location updated to %s', locationName);
        // Reduce DOM updates by only modifying if it there was a relevant change (old state !==
        // new state)
        const isSelected = locationName === this.#identifier;
        if (isSelected === this.#isSelected) return;
        const method = isSelected ? 'add' : 'remove';
        requestAnimationFrame(() => this.classList[method](this.#selectedClassName));
        this.#isSelected = isSelected;
    }

    getIdentifier() {
        return this.getAttribute('data-location');
    }

    setupClickListeners() {
        this.addEventListener('click', this.handleLocationClick.bind(this));
    }

    handleLocationClick(locationName) {
        const eventOptions = { bubbles: true, detail: { locationName: this.#identifier }};
        this.dispatchEvent(new CustomEvent('locationchange', eventOptions));
        console.log('LocationMapPoint: dispatched event locationchange with %o', eventOptions);
    }

}

window.customElements.define('location-map-point', LocationMapPoint);