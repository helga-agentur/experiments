import readAttribute from './readAttribute.mjs';
import { gsap } from './gsap/all.js';

/* Make sure that all menu items' borders are connected to each other */


/**
 * Menu item that shall be highlighted when hovered. Just dispatches a corresponding event,
 * logic is handled in <highlightable-menu>
 */
class HighlightableMenuItem extends HTMLElement {
    connectedCallback() {
        this.addEventListener('mouseenter', () => {
            const event = new CustomEvent('menuItemHover', { bubbles: true });
            this.dispatchEvent(event);
        });
    }
}


if (!window.customElements.get('highlightable-menu-item')) {
    window.customElements.define('highlightable-menu-item', HighlightableMenuItem);
}





/**
 * Highlights currently hovered menu item. Corresponding event is dispatched by 
 * <hoverable-menu-item>.
 */
class HighlightableMenu extends HTMLElement {

    #highlightElement;
    #activeItem;

    connectedCallback() {
        this.#getElements();
        this.#setupListeners();
    }

    #getElements() {
        this.#highlightElement = readAttribute(
            this,
            'data-highlight-selector',
            {
                transform: (selector) => this.querySelector(selector),
                validate: (element) => element instanceof HTMLElement,
                expectation: 'to be a selector that selects an HTMLElement',
            },
        );
        this.#activeItem = readAttribute(
            this,
            'data-active-item-selector',
            {
                transform: (selector) => this.querySelector(selector),
                validate: (element) => element instanceof HTMLElement,
                expectation: 'to be a selector that selects an HTMLElement',
            },
        )
    }

    #setupListeners() {
        window.addEventListener('menuItemHover', ({ target }) => {
            this.#updateHighlightPosition(target);
        });
        this.addEventListener('mouseleave', () => {
            this.#updateHighlightPosition(this.#activeItem);
        });
    }

    #getHoverPosition(item) {
        // If x is 0, it will be positioned just left to the *active* element
        const activeRect = this.#activeItem.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        const x = Math.floor(itemRect.left - activeRect.left);
        const difference = Math.abs(gsap.getProperty(this.#highlightElement, 'x') - x);
        return { x, difference };
    }

    #updateHighlightPosition(element) {
        const { x, difference } = this.#getHoverPosition(element);
        gsap.killTweensOf(this.#highlightElement);
        const timeline = gsap.timeline();
        timeline
            .to(
                this.#highlightElement,
                {
                    x,
                    duration: 1,
                    ease: 'power4.inOut',
                },
            )
            .to(
                this.#highlightElement,
                {
                    // The wider the distance, the wider the dot during the transition; make sure
                    // we don't scale below 1
                    scaleX: Math.max(1, difference / 20),
                    duration: 0.5,
                    filter: 'blur(1px)',
                    ease: 'power2.in',
                },
                '<',
            )
            .to(
                this.#highlightElement,
                {
                    scaleX: 1,
                    duration: 0.5,
                    filter: 'blur(0)',
                    ease: 'power2.out',
                },
                '>',
            );
        timeline.timeScale(2.5).play();
    }

}

if (!window.customElements.get('highlightable-menu')) {
    window.customElements.define('highlightable-menu', HighlightableMenu);
}