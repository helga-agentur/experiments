import gsap from '../../node_modules/gsap/all.js';
import morph from './morph.js';


class AnimatedContactForm extends HTMLElement {
    
    #actionContainer;
    #actions;
    #textarea;
    #formElements;
    #timeScale = 2;

    connectedCallback() {
        // TODO: Shall we move the selectors to properties? Yes, because it makes the JS
        // independent from the DOM. No because this component is super-specific and there's no
        // use in making it abstract.
        this.#formElements = this.querySelectorAll('.form > *:not(textarea)');
        this.#actionContainer = this.querySelector('.actionContainer');
        this.#actions = this.#actionContainer.querySelectorAll('.action'); 
        this.#textarea = this.querySelector('textarea');
        
        this.#setupClickListeners();        
    }
    
    /**
     * Listens on click on any of the actions
     */    
    #setupClickListeners() {
        [...this.#actions].forEach((action) => {
            action.addEventListener('click', ({ target }) => this.#showContactForm(target));
        });
    }

    /**
     * Morphs the clicked action HTML element into the textarea of the contact form
     * @param {HTMLElement} clickedAction 
     * @returns {GSAP.Tween}
     */
    #morphActionIntoTextarea(clickedActionElement) {
        return morph(
            clickedActionElement,
            this.#textarea,
            {
                morphProperties: [
                    'height',
                    'width',
                    'borderRadius',
                    'paddingLeft',
                    'paddingRight',
                    'paddingTop',
                    'paddingBottom',
                ],
                duration: 3,
            }
        );
    }
    
    /**
     * Does the whole magic by hiding actions, morphing clicked action into the textarea and
     * showing form elements, then removing the actions
     * @param {HTMLElement} clickedActionElement 
     */
    #showContactForm(clickedActionElement) {

        const timeline = gsap.timeline({ default: { ease: 'power3.inOut' } });
        
        // Fade all actions out – except for the clicked one
        timeline.to(
            [...this.#actions].filter((action) => action !== clickedActionElement),
            { duration: 1, opacity: 0, stagger: 0.2 },
        );

        // Fade clicked action button out by making everything it contains white (which
        // corresponds to the background color). Afterwards, morph Element
        timeline.to(
            [clickedActionElement, ...clickedActionElement.querySelectorAll('*')],
            {
                color: 'white',
                borderColor: 'white',
                backgroundColor: 'white',
                duration: 0.2,
            },
            '<0',
        );

        timeline.add(() => clickedActionElement.style.opacity = 0, '<');
        const morphFunction = this.#morphActionIntoTextarea(clickedActionElement);
        timeline.add(morphFunction, '<');

        timeline.add(() => {
            this.#textarea.textContent = `Ich möchte ${clickedActionElement.textContent}!`;
            this.#textarea.style.opacity = 1;
        }, '>');

        // Fade all form elements in
        timeline.to(
            this.#formElements,
            {
                opacity: 1,
                duration: 1,
                stagger: 0.1,
            },
            '<-=1',
        );

        // Fade morph element out to make textarea behind it visible
        timeline.to(
            morphFunction.data.morphElement,
            {
                opacity: 0,
                duration: 0.3,
                onComplete: () => morphFunction.data.morphElement.style.display = 'none',
            },
            '<+=1',
        )
        
        // Focus first input element
        timeline.add(() => {
            const firstInput = [...this.#formElements].find((item) => 
                item.nodeName.toLowerCase() === 'input'
            );
            if (firstInput) firstInput.focus();
        }, '<');

        // Remove the whole action container to make sure it does not cover the form or takes
        // any inputs
        timeline.add(() => this.#actionContainer.style.display = 'none');
        
        timeline.timeScale(this.#timeScale);

    }

}

if (!window.customElements.get('animated-contact-form')) {
    window.customElements.define('animated-contact-form', AnimatedContactForm);
}
