class StrongPoint extends HTMLElement {

    #name;
    #scrollProgressIndicator;

    // Performance related stuff
    #requestedAnimationFrame;
    #scrollProgress;

    connectedCallback() {
        this.#name = this.dataset.name;
        this.#setupVisibilityListeners();
        this.#setupClickListener();
        this.#scrollProgressIndicator = this.querySelector('.c-model-step__progress');
    }

    #setupVisibilityListeners() {
        window.addEventListener('sectionVisibility', ({ detail: { name }}) => {
            this.#updateVisibility(name === this.#name);
        });
        window.addEventListener('sectionVisibilityProgress', ({ detail: { name, progress }}) => {
            if (name !== this.#name) this.#updateScrollProgressIndicator(0);
            else this.#updateScrollProgressIndicator(progress);
        });
    }

    #setupClickListener() {
        this.addEventListener('click', () => {
            // TODO: Make beautiful
            console.log('scroll to', this.#name);
            const section = document.querySelector(`[data-section][data-name=${this.#name}]`);
            const { top } = section.getBoundingClientRect();
            console.log('top', top);
            // Scroll so that the element's top aligns to the window's center
            window.scrollBy({
                left: 0,
                top: top - (window.innerHeight / 2) + 10,
                behavior: 'smooth',
            });
        });
    }

    #updateScrollProgressIndicator(percent) {
        this.#scrollProgress = percent;
        if (this.#requestedAnimationFrame) return;
        this.#requestedAnimationFrame = requestAnimationFrame(() => {
            this.#executeScrollProgressIndicatorUpdate();
            this.#requestedAnimationFrame = null;
        });
    }

    #executeScrollProgressIndicatorUpdate() {
        this.#scrollProgressIndicator.style.transform = `scaleY(${this.#scrollProgress})`;
        this.style.transform = `translateY(${this.#scrollProgress * -10}px)`;
    }

    #updateVisibility(visible) {
        this.classList.toggle('c-model-step--expanded', visible);
    }

}

if (!window.customElements.get('strong-point')) {
    window.customElements.define('strong-point', StrongPoint);
}
