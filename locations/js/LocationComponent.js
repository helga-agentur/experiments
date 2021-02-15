class LocationComponent extends HTMLElement{

    // Holds registered child components
    #childComponents = [];

    constructor() {
        super();
        this.setupChildComponentListener();
        this.setupLocationChangeListener();
    }
    
    /**
     * Listens to registerlocationdisplay event fired by child elements
     */
    setupChildComponentListener() {
        this.addEventListener('registerlocationdisplay', this.handleChildComponentEvent.bind(this));
        console.log('LocationComponent: Child element listener ready');
    }

    /**
     * Sets up listener for locationchange event that is fired by child components
     */
    setupLocationChangeListener() {
        this.addEventListener('locationchange', this.handleLocationChange.bind(this));
    }

    /**
     * Handles registerlocationdisplay fired by child elements and adds elements to 
     * this.#childComponents
     */
    handleChildComponentEvent(ev) {
        const component = ev.target;
        // If child does not have an updateLocation method, it is of no use – display warning
        // and ignore child
        if (typeof ev.target.updateLocation !== 'function') {
            console.warn('LocationComponent: registerlocationdisplay was fired from target %o that does not have a updateLocation method', component);
            return;
        }
        this.#childComponents.push(ev.target);
        console.log('LocationComponent: Child component %o registered', ev.target);
    }

    /**
     * Handles a locationchange event
     */
    handleLocationChange(ev) {
        const { locationName } = ev.detail;
        if (!locationName) {
            console.warn('Caught locationchange event without locationName property %o; cannot update locations', ev);
            return;
        }
        this.notifyChildrenOfLocationChange(locationName);
    }

    /**
     * Notifies all this.#childComponents of a locationchange event and passes the new location
     * to them
     */
    notifyChildrenOfLocationChange(locationName) {
        this.#childComponents.forEach(component => component.updateLocation(locationName));
    }


}

window.customElements.define('location-component', LocationComponent);