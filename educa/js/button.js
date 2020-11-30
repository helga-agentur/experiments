const button = document.querySelector('.btn');

class EducaButton {

    #element = null;
    #hoverContent = null;

    constructor({ element } = {}) {
        if (!(element instanceof HTMLElement)) {
            throw new Error(`EducaButton: Attribute element is not a HTMLElement, but ${element}.`);
        }
        this.#element = element;
    }

    init() {
        this.createHoverContent();
        this.addMouseListeners();
    }

    createHoverContent() {
        const children = this.#element.children;
        if (children.length > 1) {
            console.warn('EducaButton: Should contain exactly one child, contains %o instead', children);
        }
        const clone = children[0].cloneNode(true);
        clone.setAttribute('aria-hidden', true);
        clone.classList.add('hover');
        this.#hoverContent = clone;
        this.#element.insertBefore(clone, null);
    }

    addMouseListeners() {
        this.#element.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
        this.#element.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    }

    handleMouseEnter(ev) {
        const { offsetX, offsetY } = ev;
        const { width, height } = this.#hoverContent.getBoundingClientRect();
        // Get maximum radius for the hover content. Maximum radius is given if mouse enter e.g.
        // bottom left corner of the button: it must span the whole button (i.e. to the top right)
        const maxRadius = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
        // Reduce maxRadius by the distance the mouse cursor has from the extremes (i.e. from
        // top/bottom right/left). Only use x distance for simplicity.
        const radius = maxRadius - Math.min(offsetX, width - offsetX);
        // Position clip-path at the place where the mouse entered the button (without animation)
        requestAnimationFrame(() => {
            // Remove transition while positioning the clipPath at the place of mouse entry
            const transition = window.getComputedStyle(this.#hoverContent).transition;
            this.#hoverContent.style.transition = 'none';
            this.#hoverContent.style.clipPath = `circle(0% at ${offsetX}px ${offsetY}px)`;
            requestAnimationFrame(() => {
                // Re-add original transition
                this.#hoverContent.style.transition = transition;
                this.#hoverContent.style.clipPath = `circle(${radius}px at ${offsetX}px ${offsetY}px)`;    
            });
        });
    }

    handleMouseLeave(ev) {
        const { offsetX, offsetY } = ev;
        // Adjust position so that end position is outside the button (appears more natural)
        const { height, width } = this.#hoverContent.getBoundingClientRect();
        // Let the circle have a size of 0 outside the button, not exactly at the place where
        // the cursor left the button (it looks more natural/better)
        const adjustOffsetBy = 20;
        const adjustedOffsetX = offsetX > width / 2 ? offsetX + adjustOffsetBy :
            offsetX - adjustOffsetBy;
        const adjustedOffsetY = offsetY > height / 2 ? offsetY + adjustOffsetBy :
            offsetY - adjustOffsetBy;
        requestAnimationFrame(() => {
            this.#hoverContent.style.clipPath = `circle(0% at ${adjustedOffsetX}px ${adjustedOffsetY}px)`;
        });
    }

}

const btn = new EducaButton({ element: button });
btn.init();



