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
    }

    #setupScrollListener() {
        window.addEventListener('scroll', this.#handleScroll.bind(this));
    }

    #handleScroll(event) {
        this.#scrollPosition = window.pageYOffset;
        if (!this.#requestedAnimationFrame) {
            window.requestAnimationFrame(this.#updateImages.bind(this));
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

    #setContainerHeight() {
        // Container height update is optional; attribute is not required
        const selector = this.dataset.containerSelector;
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