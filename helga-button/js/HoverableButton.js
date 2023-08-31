import { gsap } from '../../node_modules/gsap/all.js';

class HoverableButton extends HTMLElement {

    #width;
    #height;
    #button;
    #textElement;
    #hoverZTranslation = 10;

    connectedCallback() {
        this.#measureElement();
        this.#setupMouseListener();
    }

    #getButton() {
        if (!this.#button) this.#button = this.children[0];
        return this.#button;
    }

    #getTextElement() {
        if (!this.#textElement) this.#textElement = this.#getButton().children[0];
        return this.#textElement;
    }

    // TODO: Solve nicely
    #measureElement() {
        const dimensions = this.#getButton().getBoundingClientRect();
        this.#width = dimensions.width;
        this.#height = dimensions.height;
    }

    #setupMouseListener() {
        this.addEventListener('mousemove', this.#handleOver.bind(this));
        this.addEventListener('mouseleave', this.#handleLeave.bind(this));
        this.addEventListener('click', this.#handleClick.bind(this));
    }

    #handleLeave() {
        // this.#timeline.();
        gsap.to(
            this.#getButton(),
            {
                translateZ: 0,
                rotateY: 0,
                rotateX: 0,
                x: 0,
                y: 0,
                duration: 0.3,
            },
        );

        gsap.to(this.#getTextElement(), { scale: 1, duration: 0.3 });

    }

    #handleOver(event) {
        
        // Percents are values between -1 and 1
        const leftPercent = (0.5 - (event.offsetX / this.#width)) * -2;
        const topPercent = (0.5 - (event.offsetY / this.#height)) * -2;
        // Maximum angle the button can have when hovered, in deg
        const maxAngle = 3;
        const maxTranslation = this.#hoverZTranslation;
        
        gsap.to(
            this.#getButton(),
            {
                translateZ: 10,
                rotateY: leftPercent * maxAngle,
                rotateX: topPercent * maxAngle,
                duration: 0.3,
                x: leftPercent * maxTranslation,
                y: topPercent * maxTranslation,
            }
        );

        gsap.to(this.#getTextElement(), { scale: 1.05, duration: 0.3 });

    }

    #handleClick() {
        gsap.timeline({ defaults: { duration: 0.07 } })
            .to(
                this.#getButton(),
                {
                    translateZ: -5,
                },
            )
            .to(
                this.#getButton(),
                {
                    translateZ: this.#hoverZTranslation,
                }
            );
    }

}

if (!window.customElements.get('hoverable-button')) {
    window.customElements.define('hoverable-button', HoverableButton);
}