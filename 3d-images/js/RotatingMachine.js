class RotatingMachine extends HTMLElement {
    
    /**
     * How many images will cover 360deg?
     * @type {Number}
     */
    #amountOfImages = 360;

    /**
     * Stores the image that will be displayed next when animationFrame is requested
     * @type {HTMLImageElement}
     */
    #nextVisibleImage;

    /**
     * The currently visible image (that shall be hidden when the next animationFrame is requested)
     * @type {HTMLImageElement}
     */
    #visibleImage;

    /**
     * Cache all image elements for faster access
     * @type {HTMLImageElement[]}
     */
    #images;

    /**
     * Holds a reference to the scrollTrigger to speed upaccess
     * @type {HTMLElement}
     */
    #scrollTrigger;

    connectedCallback() {
        this.#registerHandlerWithScrollTrigger();
        this.#addImages();
        this.#getImages();
        this.#addLoadListener();
    }

    #getScrollTrigger() {
        if (!this.#scrollTrigger) {
            this.#scrollTrigger = this.closest('scroll-trigger');
        }
        return this.#scrollTrigger;
    }

    #registerHandlerWithScrollTrigger() {
        this.#getScrollTrigger().addHandler(this.#handleProgress.bind(this));
    }

    #addLoadListener() {
        // If images are not loaded, there's no height on them.
        // Only listen to the first image; all others are positioned absolutely.
        this.#getImages().at(0).addEventListener('load', () => this.#getScrollTrigger().measure());
    }

    #getImages() {
        // Cache items for performance and to make sure they're always set, no matter where the
        // function is called from (therefore we don't access this.#images)
        if (!this.#images) {
            this.#images = [...this.querySelectorAll('img')];
            this.#visibleImage = this.#images.at(0);
        }
        return this.#images
    }

    #addImages() {
        const degreesPerImage = 360 / this.#amountOfImages;
        const images = Array.from({ length: this.#amountOfImages }).map((item, index) => {
            const src = `./img/avif/${String((index * degreesPerImage) + 1).padStart(5, '0')}.avif`;
            return `<img src="${src}" />`;
        })
        this.innerHTML = images.join('\n');
    }

    #handleProgress(progress) {
        const newImageNumber = Math.floor(this.#amountOfImages * progress) + 1;
        // Number is the index of the image within this.#images, therefore between 0 and 359
        const constrainedNewImageNumber = Math.max(0, Math.min(
            this.#amountOfImages - 1, newImageNumber
        ));
        this.#nextVisibleImage = this.#images.at(constrainedNewImageNumber);
        if (this.#visibleImage === this.#nextVisibleImage) return;
        this.#visibleImage.style.opacity = 0;
        this.#nextVisibleImage.style.opacity = 1;
        this.#visibleImage = this.#nextVisibleImage;
        this.#nextVisibleImage = null;
    }
}

if (!window.customElements.get('rotating-machine')) {
    window.customElements.define('rotating-machine', RotatingMachine);
}