// From ChatGPT

// Function for smooth interpolation (lerp)
const lerp = (start, end, t) => start + (end - start) * t;

// Main scrub function with delay
const scrub = (startValue, endValue, delay, callback = () => console.log) => {

    let targetValue = startValue;
    let currentValue = startValue;

    function scroll(progress) {
        console.log('progress set to', progress);
        targetValue = lerp(startValue, endValue, progress);
    }

    function update() {
        // Lerp with a delay factor
        currentValue = lerp(currentValue, targetValue, delay);

        // Apply the updated value to the element (for example, translate X)
        // element.style.transform = `translateX(${currentValue}px)`;
        // return currentValue;
        callback(currentValue);

        // Keep requesting animation frame for smooth update
        requestAnimationFrame(update);
    }

    // Start the update loop
    requestAnimationFrame(update);

    return scroll;
}
  





class RotatingMachine extends HTMLElement {
    // Measure dimensions only when needed; then cache those values.
    #top;
    #height;
    #animationFrame;

    #scrub = scrub(0, 1, 0.1, this.#handleProgress.bind(this));
    
    // How many images will cover 360deg?
    #amountOfImages = 180;

    /**
     * Stores the image that will be displayed next when animationFrame is ready.
     * @type {HTMLImageElement}
     */
    #nextVisibleImage;

    /**
     * @type {HTMLImageElement}
     */
    #visibleImage;

    /**
     * Cache all image elements for faster access.
     * @type {HTMLImageElement[]}
     */
    #images;

    #boundScrollHandler = this.#handleScroll.bind(this);

    connectedCallback() {
        this.#addImages();
        this.#getImages();
        this.#addLoadListener();
        this.#addResizeListener();
        this.#addIntersectionObserver();
        this.#measure();
    }

    #addLoadListener() {
        // If images are not loaded, there's no height on them; TBD: Only await load of the one
        // visible element
        // Only listen to the first image; all others are absolutely positioned.
        this.#getImages().at(0).addEventListener('load', this.#measure.bind(this));
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

    #addResizeListener() {
        // TBD: Debounce
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
        console.log('Set top to %d, height to %d', this.#top, this.#height)
    }

    #addScrollListener() {
        window.addEventListener('scroll', this.#boundScrollHandler);
    }
    
    #removeScrollListener() {
        window.removeEventListener('scroll', this.#boundScrollHandler);
    }


    #handleScroll(event) {
        // Start is reached when the scrollTop is 100 vh above the top of the element
        const start = this.#top - window.innerHeight;
        // End is reached when the scrollTop is at the bottom of the element
        const end = this.#top + this.#height;
        const difference = end - start;
        const progress = (window.scrollY - start) / difference;
        // this.#handleProgress(progress);
        this.#scrub(progress);
    }

    #handleProgress(progress) {
        const newImageNumber = Math.floor(this.#amountOfImages * progress) + 1;
        // Number is the index of the image within this.#images, therefore between 0 and 359
        const constrainedNewImageNumber = Math.max(0, Math.min(
            this.#amountOfImages - 1, newImageNumber
        ));
        this.#nextVisibleImage = this.#images.at(constrainedNewImageNumber);
        // if (!this.#animationFrame) {
        //     this.#animationFrame = requestAnimationFrame(this.#scheduleUpdate.bind(this));
        // }
        this.#scheduleUpdate();
    }

    #scheduleUpdate() {
        this.#animationFrame = null;
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