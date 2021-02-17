/**
 * Stores children that send a registerlocationelement event (and removes them on
 * deregisterlocationelement). Catches locationchange events and adds all children to their
 * detail.targets property. 
 * 
 * Why? To ensure that events of children are scoped to the component (and we thereby don't update
 * the location on other location components on a page)
 */
class LocationComponent extends HTMLElement{

    #childComponents = [];

    connectedCallback() {
        this.setupChildComponentListener();
        this.addEventListener('locationchange', this.handleLocationChange.bind(this));
    }

    
    setupChildComponentListener() {
        this.addEventListener(
            'registerlocationelement',
            ev => this.#childComponents.push(ev.target),
        );
        this.addEventListener(
            'deregisterlocationelement',
            ev => this.#childComponents = this.#childComponents.filter(item => item !== ev.target),
        );

    }
    
    handleLocationChange(ev) {
        // If it's an event already handled by this component, ignore it and let it bubble.
        if (ev.target === this) return;
        ev.stopPropagation();
        this.dispatchEvent(new CustomEvent('locationchange', {
            bubbles: true,
            detail: { ...ev.detail, targets: this.#childComponents },
        }));
    }

}

window.customElements.define('location-component', LocationComponent);