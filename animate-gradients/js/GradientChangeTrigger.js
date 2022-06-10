class GradientChangeTrigger extends HTMLElement {

    #gradientFrom = null;
    #gradientTo = null;

    connectedCallback() {
        this.#gradientFrom = this.#validateHexValue(this.getAttribute('data-from'));
        this.#gradientTo = this.#validateHexValue(this.getAttribute('data-to'));
        this.#setupIntersectionObserver();
        this.#registerElement();
    }

    #setupIntersectionObserver() {
        const observer = new IntersectionObserver(this.#handleIntersection.bind(this));
        observer.observe(this);
    }

    #handleIntersection(entries) {
        console.log(entries[0].boundingClientRect)
        this.dispatchEvent(new CustomEvent('gradientVisibilityChange', {
            detail: {
                visible: entries[0].isIntersecting,
            },
            bubbles: true,
        }));
    }

    /**
     * In order for <gradient-background> to prepare all gradients (that will only be moved when
     * animating), we must first register all gradients at <gradient-background>.
     */
    #registerElement() {
        this.dispatchEvent(new CustomEvent('addGradient', {
            detail: {
                // Send x position to setup gradient in the right orders
                x: this.getBoundingClientRect().top + window.pageYOffset,
                gradientFrom: this.#gradientFrom,
                gradientTo: this.#gradientTo,
            },
            bubbles: true,
        }));
    }

    /**
     * Checks if the value passed is a valid hex value
     * @param {string} value 
     * @returns {string}            Original value
     * @throws                      Error if value passed is not hex
     */
    #validateHexValue(value) {
        if (!/[0-9A-Fa-f]{6}/g.test(value)) {
            throw new Error(`Value ${value }passed is not a valid hex value; use hex values for data-from and data-to properties on every <gradient-change-trigger>`);
        }
        return value;
    }

}

if (!customElements.get('gradient-change-trigger')) {
    customElements.define('gradient-change-trigger', GradientChangeTrigger);
}
