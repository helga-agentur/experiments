


/**
 * PREFER IMAGES because
 * - current time cannot be set in Chrome with currentTime (is ignoring it)
 * - file size is comparable (except for AV1 without good enoguh support)
 * - performance is subpar in Firefox
 */

class RotatingVideo extends HTMLElement {
    // Measure dimensions only when needed; then cache those values.
    #top;
    #height;
    #animationFrame;    
    #boundScrollHandler = this.#handleScroll.bind(this);
    #video;
    #duration;
    #currentTime;

    connectedCallback() {
        this.#getVideo();
        this.#addResizeListener();
        this.#addIntersectionObserver();
        this.#measure();
    }

    #getVideo() {
        // Cache items for performance and to make sure they're always set, no matter where the
        // function is called from (therefore we don't access this.#images)
        if (!this.#video) {
            this.#video = this.querySelector('video');
            // Quick & dirty, good enough for PoC
            this.#video.addEventListener(
                'durationchange',
                () => this.#duration = this.#video.duration,
            );
            // Quiiiiick & dirty again
            this.#video.addEventListener('canplay', () => {
                this.#measure();
                // We must play the video in order to jump to currentTime
                this.#video.play();
                this.#video.pause();
            });
            this.#duration = this.#video.duration;
        }
        return this.#video;
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
        this.#handleProgress(progress);
    }

    #handleProgress(progress) {
        if (!this.#duration) {
            console.log('duration not yet known');
            return;
        }
        const playhead = progress * this.#duration;
        const cappedPlayhead = Math.max(0, Math.min(this.#duration, playhead));
        this.#currentTime = parseFloat(cappedPlayhead.toFixed(2));
        if (!this.#animationFrame) {
            this.#animationFrame = requestAnimationFrame(this.#scheduleUpdate.bind(this));
        }
    }

    #scheduleUpdate() {
        this.#animationFrame = null;
        console.log('set to', this.#currentTime);
        this.#video.currentTime = this.#currentTime;
        this.#video.play();
        // this.#video.pause();
    }
}

if (!window.customElements.get('rotating-video')) {
    window.customElements.define('rotating-video', RotatingVideo);
}