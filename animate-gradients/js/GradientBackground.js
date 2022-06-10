class GradientBackground extends HTMLElement {

    /**
     * If user scrolls out of a gradient-change-trigger (1) into an already visible
     * gradient-change-trigger (2), no intersection event will happen on (2) as it is already
     * visible – just on (1). We therefore have to have an ability to go back to the previous
     * gradient if an "out" event happens but not an "in" event
     */
    #gradientHistory = [];

    /**
     * Stores all gradients in order of their x position; contains objects of structure:
     * {
     *   x: {int}
     *   from: {string}
     *   to: {string}
     *   element: {HTMLElement}
     * }
     */
    #gradients = [];

    connectedCallback() {
        this.#setupGradientRegisterListener();
        this.#setupGradientVisibilityChangeListener();
        this.#setupWindowsResizeListener();
    }

    #setupGradientRegisterListener() {
        window.addEventListener('gradientVisibilityChange', (ev) => {
            if (!ev.detail.visible) return;
            console.log('vis', ev.target.textContent);
            const index = this.#gradients.findIndex(item => item.element === ev.target);
            console.log('scroll to', index, this.#gradients);
            requestAnimationFrame(() => {
                this.style.backgroundPosition = `${index * -100}vh`;
            });
        });
    }

    #setupWindowsResizeListener() {
        window.addEventListener('resize', () => {
            // TODO: Please add 100ms debounce
            console.log('resize');
        });
    }

    /**
     * Updates gradients in the background; needed on window resize and when a new
     * <gradient-change-trigger> is discovered
     */
    #updateGradients() {
        const percentageSteps = 100 / this.#gradients.length;
        const gradients = this.#gradients
            .map((item, index) => (
                `${item.from} ${index * percentageSteps}%, ${item.to} ${(index + 1) * percentageSteps}%` 
            ))
            .join(', ');
        console.log('grad', gradients);
        requestAnimationFrame(() => {
            // TODO: Replace square with correct width
            this.style.width = `${this.#gradients.length * 100}vh`;
            this.style.backgroundImage = `linear-gradient(-60deg, ${gradients})`;
        });
    }

    #setupGradientVisibilityChangeListener() {
        // TODO: Add debounce
        window.addEventListener('addGradient', (ev) => {
            this.#gradients.push({
                x: ev.detail.x,
                from: ev.detail.gradientFrom,
                to: ev.detail.gradientTo,
                element: ev.target,
            });
            // Sort gradients by x position (top-most with lowest x position first)
            this.#gradients.sort((a, b) => a.x - b.x);
            this.#updateGradients();
        });
    }

}

if (!customElements.get('gradient-background')) {
    customElements.define('gradient-background', GradientBackground);
}
