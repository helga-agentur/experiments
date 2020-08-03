class CounterButton extends HTMLElement {

    constructor() {
        super();
        this.addClickListener();
        this.result = this.querySelector('.result');
    }

    connectedCallback() {
        const event = new CustomEvent('register-element', {
            bubbles: true,
            detail: { element: this },
        });
        // Short delay to make sure event listeners are ready
        setTimeout(() => this.dispatchEvent(event));
    }

    disconnectedCallback() {
        const event = new CustomEvent('unregister-element', {
            bubbles: true,
            detail: { element: this },
        });
        this.dispatchEvent(event);
    }

    addClickListener() {
        this.addEventListener('click', () => {
            if (this.model) this.model.add();
        });
    }

    setModel(model) {
        this.model = model;
        this.setupModelListeners();
    }

    setupModelListeners() {
        this.model.on('update', this.scheduleDOMUpdate.bind(this));
    }

    scheduleDOMUpdate() {
        this.raf = requestAnimationFrame(this.updateDOM.bind(this));
    }

    updateDOM() {
        this.result.textContent = this.model.counter;
    }

}

window.customElements.define('counter-button', CounterButton);

export default CounterButton;