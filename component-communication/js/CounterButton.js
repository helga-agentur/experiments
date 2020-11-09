import canRegister from './isDependentComponent.js';
import canScheduleDOM from './updateDOM.js';

class CounterButton extends HTMLElement {

    constructor() {
        super();
        this.result = this.querySelector('.result');

        Object.assign(
            this,
            canScheduleDOM(),
            canRegister({ eventName: 'register-element' }),
        );
        this.addClickListener();
    }

    onModelChange() {
        this.model.on('update', this.scheduleDOMUpdate.bind(this));
        this.scheduleDOMUpdate();
    }

    connectedCallback() {
        this.register();
    }

    addClickListener() {
        this.addEventListener('click', () => {
            if (this.model) this.model.add();
        });
    }

    updateDOM() {
        this.result.textContent = this.model.counter;
    }

}

window.customElements.define('counter-button', CounterButton);

export default CounterButton;