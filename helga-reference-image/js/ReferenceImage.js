import { gsap } from '../../node_modules/gsap/all.js';
import { ScrollTrigger } from '../../node_modules/gsap/ScrollTrigger.js'
import { readAttribute } from '../../node_modules/@joinbox/ui-tools/main.mjs';

gsap.registerPlugin(ScrollTrigger);


class ReferenceImage extends HTMLElement {

    #initialRotationZ;
    #finalRotationZ;
    #initialRotationY;
    #finalRotationY;
    
    connectedCallback() {
        this.#initialRotationZ = readAttribute(
            this,
            'data-initial-rotation-z',
            {
                transform: (value) => parseFloat(value),
                validate: (value) => !Number.isNaN(value),
                expectation: 'valid float number',
            },
        );
        this.#finalRotationZ = readAttribute(
            this,
            'data-final-rotation-z',
            {
                transform: (value) => parseFloat(value),
                validate: (value) => !Number.isNaN(value),
                expectation: 'valid float number',
            },
        );

        this.#initialRotationY = readAttribute(
            this,
            'data-initial-rotation-y',
            {
                transform: (value) => parseFloat(value),
                validate: (value) => !Number.isNaN(value),
                expectation: 'valid float number',
            },
        );
        this.#finalRotationY = readAttribute(
            this,
            'data-final-rotation-y',
            {
                transform: (value) => parseFloat(value),
                validate: (value) => !Number.isNaN(value),
                expectation: 'valid float number',
            },
        );

        this.#setupScrollListener();
    }

    #setupScrollListener() {
        gsap.timeline({
            scrollTrigger: {
                scrub: 1.2,
                trigger: this,
                start: 'top bottom',
                end: 'bottom top',
                markers: true,
            },
        })
        .fromTo(
            this,
            {
                rotation: this.#initialRotationZ,
                rotationY: this.#initialRotationY,
                zoom: 1.1,
                y: -80,
            }, {
                rotation: this.#finalRotationZ,
                rotationY: this.#finalRotationY,
                ease: 'power3.inOut',
                zoom: 1,
                y: 0,
            }
        )
    }

}

if (!window.customElements.get('reference-image')) {
    window.customElements.define('reference-image', ReferenceImage);
}