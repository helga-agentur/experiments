import { readAttribute } from "../../node_modules/@joinbox/ui-tools/main.mjs";

class SetClassWhenScrolled extends HTMLElement {

    #previousScrollPosition = 0;
    #hasScrolledClass = false;
    #scrolledClassName;
    #resetElementSelector;

    connectedCallback() {
        this.#getAttributes();
        this.#setupScrollListener();
        if (this.#resetElementSelector) this.#setupResetElementListener();
    }

    #getAttributes() {
        this.#scrolledClassName = readAttribute(
            this,
            'data-scrolled-class-name',
            {
                validate: (value) => !!value,
                expectation: 'a non-empty string',
            },
        );
        this.#resetElementSelector = readAttribute(
            this,
            'data-reset-element-selector',
        );
    }

    #setupResetElementListener() {
        const resetElement = this.querySelector(this.#resetElementSelector);
        if (!resetElement) {
            throw new Error(`Reset element with selector ${this.#resetElementSelector} not found within component.`);
        }
        resetElement.addEventListener('mouseenter', () => {
            if (this.#hasScrolledClass) this.#updateClass(false);
        });
    }

    #setupScrollListener() {
        window.addEventListener('scroll', this.#handleScroll.bind(this));
    }

    #handleScroll() {
        const { scrollY } = window;
        const scrolledDown = scrollY > this.#previousScrollPosition;
        if (!this.#hasScrolledClass && scrolledDown) this.#updateClass(true);
        else if (this.#hasScrolledClass && !scrolledDown) this.#updateClass(false);
        this.#previousScrollPosition = scrollY;
    }

    #updateClass(isScrolled) {
        this.classList.toggle(this.#scrolledClassName, isScrolled);
        this.#hasScrolledClass = isScrolled;
    }

}

if (!window.customElements.get('set-class-when-scrolled')) {
    window.customElements.define('set-class-when-scrolled', SetClassWhenScrolled);
}