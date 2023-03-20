/**
 * Revelas images through clip-path while a user scrolls down and hides them again when he
 * scrolls up.
 * 
 * Attributes
 * - data-scroll-speed (required, float): Speed factor; if factor is 1, for every pixel that a user
 *                                        scrolls down, 1 pixel of an image is revealed
 * - data-container-selector (rquired, string): Selector for a HTML element that is used as
 *                                              scroll container. Its min-height CSS property will
 *                                              be set so that all images are revealed while
 *                                              scrolling.
 * - data-images-selector (required, string). Selector for the HTML elements that should be
 *                                            relvealed; those must be children of the element.
 */

class ImageScrollReveal extends HTMLElement {

    #images = [];
    #scrollSpeed = 1;
    // Cache element height to improve performance
    #imageHeight = 0;
    #scrollPosition = 0;
    #requestedAnimationFrame = null;

    connectedCallback() {
        this.#getScrollSpeed();
        this.#getImages();
        this.#measureImageHeight();
        this.#setupResizeListener();
        this.#setupScrollListener();
        this.#setContainerHeight();
    }

    #getScrollSpeed() {
        const speed = parseFloat(this.dataset.scrollSpeed);
        this.#scrollSpeed = Number.isNaN(speed) ? 1 : speed;
    }

    #getImages() {
        const selector = this.dataset.imagesSelector;
        if (!selector) {
            throw new Error('Required attribute data-images-selector is missing.');
        }
        this.#images = Array.from(this.querySelectorAll(selector));
        if (this.#images.length === 0) {
            console.warn('No images found that match selector %s', selector);
        }
    }

    #setupScrollListener() {
        window.addEventListener('scroll', this.#handleScroll.bind(this));
    }

    #handleScroll(event) {
        this.#scrollPosition = window.pageYOffset;
        if (!this.#requestedAnimationFrame) {
            this.#requestedAnimationFrame = window.requestAnimationFrame(this.#updateImages.bind(this));
        }
    }

    #getCurrentImageIndex() {
        return Math.min(
            // Make sure index is not larger than images available
            this.#images.length - 1,
            Math.floor(this.#getVirtualScrollPosition() / this.#imageHeight)
        );

    }

    #getVirtualScrollPosition() {
        return this.#scrollPosition * this.#scrollSpeed;
    }

    #updateImages() {
        this.#requestedAnimationFrame = null;
        const currentImageIndex = this.#getCurrentImageIndex();
        // Don't clip last image – it stays visible all the time
        if (currentImageIndex < this.#images.length - 1) {
            const currentImageVisibility = this.#getVirtualScrollPosition() - 
                (currentImageIndex * this.#imageHeight);
            this.#images[currentImageIndex].style.clipPath = `inset(0 0 ${currentImageVisibility}px 0)`;
        }
        this.#images.forEach((image, index) => {
            const opacity = index < this.#getCurrentImageIndex() ? 0 : 1;
            image.style.opacity = opacity;
        });
    }

    #setupResizeListener() {
        // Debounce would be nice, not necessary though
        window.addEventListener('resize', () => {
            this.#measureImageHeight();
            this.#setContainerHeight();
        });
    }

    #measureImageHeight() {
        // Assume all images have the same size; return 0 if there are no images
        this.#imageHeight = this.#images[0]?.offsetHeight || 0;
    }

    /**
     * The height of the scroll container must equal at least the height of an image 
     * multiplied with the amount of images. If not, not all images will be revealed. This method
     * sets the container's height accordingly (and also respects scrollSpeed)
     */
    #setContainerHeight() {
        // Container height update is optional; attribute is not required
        const selector = this.dataset.containerSelector;
        if (!selector) return;
        // For the sake of simplicity, let us select/modify outside of this element's scope
        const container = document.querySelector(selector);
        if (!container) {
            console.warn('No container found to set height on; selector is %s', selector);
            return;
        }
        // Needs fix css height on images in order to work (without it, we'd have to await
        // image load)
        const height = this.#imageHeight * this.#images.length / this.#scrollSpeed;
        container.style.minHeight = height;
    }

}

if (!window.customElements.get('image-scroll-reveal')) {
    window.customElements.define('image-scroll-reveal', ImageScrollReveal);
}