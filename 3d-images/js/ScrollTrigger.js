import scrub from './scrub.js';

/**
 * Simple scroll trigger:
 * - Listens for child elements that register themselves as handlers by emitting a custom
 *  'registerScrollTriggerHandler' event; its detail property must provide a handler function
 *   as { scrollHandler: functionReference }
 * - Measures the element (top/height) as soon as it becomes visible and a a scroll listener
 * - Calculates the scroll progress of the element, smoothes it down (via scrub) and calls the
 *   handler with the updated value
 */
class ScrollTrigger extends HTMLElement {
    
    /**
     * Measure dimensions only when needed; then cache those values.
     * @type {Number}
     */
    #top;

    /**
     * @type {Number}
     */
    #height;

    /**
     * Slow down the animations; to do so, use an external scrub function; the return value
     * references its update function
     * @type {Function}
     */
    #scrub = scrub({ slowingFactor: 0.05, callback: this.#handleProgress.bind(this) });
 
    /**
     * Bind scroll handler in order to remove it later
     * @type {Function}
     */
    #boundScrollHandler = this.#handleScroll.bind(this);

    /**
     * All handlers that should be called on scroll
     */
    #handlers = [];

    connectedCallback() {
        this.#addResizeListener();
        this.#addIntersectionObserver();
        this.#measure();
    }

    /**
     * Add a handler that is called whenever the scroll progress changes
     * @param {function} handlerFunction
     */
    addHandler(handlerFunction) {
        this.#handlers.push(handlerFunction);
    }

    /**
     * We must also publicly expose the measure function: Measurements must be updatable from the
     * outside, e.g. when we depend on an image that is loaded asynchronously.
     */
    measure = this.#measure;

    #addResizeListener() {
        window.addEventListener('resize', this.#measure.bind(this));
    }

    #addIntersectionObserver() {
        const observer = new IntersectionObserver(this.#handleIntersectionChange.bind(this), {});
        observer.observe(this);
    }

    #handleIntersectionChange([entry]) {
        // Ignore event if element becomes hidden; there's only one entry
        if (!entry.isIntersecting) {
            this.#removeScrollListener();
        } else {
            this.#addScrollListener();
            this.#measure();
        }
    }

    #measure() {
        const { top, height } = this.getBoundingClientRect();
        this.#top = top + window.scrollY;
        this.#height = height;
    }

    #addScrollListener() {
        window.addEventListener('scroll', this.#boundScrollHandler);
    }
    
    #removeScrollListener() {
        window.removeEventListener('scroll', this.#boundScrollHandler);
    }

    #handleScroll() {
        // When scrolling down: Start point is reached when the top of the element touches the
        // bottom of the viewport.
        // Start is therefore reached when the scrollTop is 100 vh above the top of the element
        const start = this.#top - window.innerHeight;
        // End is reached when the scrollTop is at the bottom of the element
        const end = this.#top + this.#height;
        const difference = end - start;
        const progress = (window.scrollY - start) / difference;
        this.#scrub(progress);
    }

    #handleProgress(progress) {
        this.#handlers.forEach((handler) => handler(progress));
    }
}

if (!window.customElements.get('scroll-trigger')) {
    window.customElements.define('scroll-trigger', ScrollTrigger);
}