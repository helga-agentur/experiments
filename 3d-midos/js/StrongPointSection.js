import { gsap } from '../../node_modules/gsap/all.js';
import { ScrollTrigger } from '../../node_modules/gsap/ScrollTrigger.js'

gsap.registerPlugin(ScrollTrigger)

class StrongPointSection extends HTMLElement {

    #name;

    connectedCallback() {
        this.#name = this.dataset.name;
        this.#setupVisibilityListener();
    }

    #setupVisibilityListener() {
        ScrollTrigger.create({
            trigger: this,
            start: 'top center',
            end: 'bottom center',
            // markers: true,
            onToggle: ({ isActive }) => {
                if (!isActive) return;
                const options = { detail: { name: this.#name }, bubbles: true };
                const event = new CustomEvent('sectionVisibility', options);
                this.dispatchEvent(event);
            },
            onUpdate: ({ progress }) => {
                const options = { detail: { name: this.#name, progress } };
                const event = new CustomEvent('sectionVisibilityProgress', options);
                // Prevent bubbling (for speed)
                window.dispatchEvent(event);
            },
        });
        ScrollTrigger.refresh();
    }


}

if (!window.customElements.get('strong-point-section')) {
    window.customElements.define('strong-point-section', StrongPointSection);
}