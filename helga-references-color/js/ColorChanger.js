import { gsap } from '../../node_modules/gsap/all.js';
import { readAttribute } from '../../node_modules/@joinbox/ui-tools/main.mjs';

/**
 * Changes the color of a provided element's provided property whenever a colorChange event is
 * caught.
 * @attribute data-selector     Selector of the element within the current element that's property
 *                              should be updated to match the given color, e.g. 'svg.className'
 * @attribute data-property     Name of the element's property that should be updated, e.g.
 *                              'fill' or 'backgroundColor'
 * @attribute data-color-name   Name of the property in the colorChange event's detail that
 *                              should be used to update the element's property; e.g. 'light'
 *                              if colorChange event fired has { detail: { light: #efed09 } }
 * @attribute data-default-color   Value of the color that should be used if the data-color-name
 *                              property is missing or empty (used especially if a user leaves
 *                              an element that sends a colorChange event on enter)
 */
class ColorChanger extends HTMLElement {

    #colorName;
    #element;
    #property;
    #defaultColor;

    connectedCallback() {

        this.#property = readAttribute(this, 'data-property') || 'backgroundColor';

        const selector = readAttribute(this, 'data-selector');
        this.#element = selector ? this.querySelector(selector) : this;
        if (!this.#element) {
            throw new Error(`Could not find element to update color on; selector ${selector} did not match any child in ${this}`);
        }

        this.#colorName = readAttribute(
            this,
            'data-color-name',
            {
                validate: (value) => !!value,
                expectation: 'non-empty string',
            },
        );

        // We cannot take the defaultColor from the DOM as we don't know if the user has
        // already scrolled to a color-changing element and its color is already reflected
        // in the element's this.#property
        this.#defaultColor = readAttribute(
            this,
            'data-default-color',
            {
                validate: (value) => !!value,
                expectation: 'non-empty string',
            }
        )

        console.log('default color is', this.#defaultColor);
        
        this.#setupColorChangeListener();
    
    }

    #setupColorChangeListener() {
        window.addEventListener('colorChange', this.#handleColorChange.bind(this));
    }

    #handleColorChange(event) {
        const color = event?.detail[this.#colorName] || this.#defaultColor;
        // TODO: Also fire leave events (not only enter)
        console.log('update color to', color, this.#colorName);
        this.#updateValues(color);
    }

    #updateValues(color) {
        gsap.to(
            this.#element,
            {
                [this.#property]: color,
                duration: 0.7,
            }
        )
    }

}

if (!window.customElements.get('color-changer')) {
    window.customElements.define('color-changer', ColorChanger);
}