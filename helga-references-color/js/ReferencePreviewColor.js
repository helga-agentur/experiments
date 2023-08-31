import { gsap } from '../../node_modules/gsap/all.js';
import { ScrollTrigger } from '../../node_modules/gsap/ScrollTrigger.js'
import { readAttribute } from '../../node_modules/@joinbox/ui-tools/main.mjs';

gsap.registerPlugin(ScrollTrigger);


/**
 * Emits a colorChange event whenever a new reference becomes (mainly) visible. Thereby emits 
 * two properties: lightColor (e.g. for the background) and intenseColor (e.g. for the logo). If
 * the reference becomes invisible, a colorChange event with empty values for the two properties
 * is emitted.
 *
 * @attribute data-light-color      Any valid color value that is associated with the reference
 * @attribute data-intense-color    Any valid color value that is associated with the reference
 */
class ReferencePreviewColor extends HTMLElement {

    #lightColor;
    #intenseColor;

    connectedCallback() {
        this.#setupScrollListener();
        this.#lightColor = readAttribute(
            this,
            'data-light-color',
            {
                validate: (value) => !!value,
                expectation: 'to be set',
            },
        );
        this.#intenseColor = readAttribute(
            this,
            'data-intense-color',
            {
                validate: (value) => !!value,
                expectation: 'to be set',
            },
        );
    }

    /**
     * Listens to scroll events and waits for the current element to become visible
     */
    #setupScrollListener() {
        ScrollTrigger.create({
            trigger: this,
            start: 'top center',
            end: 'bottom center',
            // Emit color change event even if isActive is false: The color shall change back to
            // the default value if reference is left.
            onToggle: ({ isActive }) => this.#emitColorChangeEvent(isActive),
        });
    }


    /**
     * Emits the colorChange event; if the current element is not visible/active, it won't contain
     * color definitions (in order for the listening element to fade back to its default color)
     * @param {Boolean} isActive
     */
    #emitColorChangeEvent(isActive) {
        // If user leaves the current reference, make sure we send no colors with the event's
        // detail property
        const detail = isActive
            ? { lightColor: this.#lightColor, intenseColor: this.#intenseColor }
            : {};
        const options = {
            bubbles: true,
            detail,
        };
        const event = new CustomEvent('colorChange', options);
        this.dispatchEvent(event);
    }

}

if (!window.customElements.get('reference-preview-color')) {
    window.customElements.define('reference-preview-color', ReferencePreviewColor);
}


