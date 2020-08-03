import CounterModel from './CounterModel.js';

class CounterComponent extends HTMLElement {

    dependentComponents = [];

    constructor() {
        super();
        this.model = new CounterModel();
        this.number = this.querySelector('.number');
        this.setupRegisterElementEventListener();
        this.scheduleDOMUpdate();
        this.setupModelListener();
    }

    setupRegisterElementEventListener() {
        this.addEventListener('register-element', this.handleRegisterElement)
    }

    handleRegisterElement(ev) {
        const { element } = ev.detail;
        this.dependentComponents.push(element);
        element.setModel(this.model);
    }

    setupModelListener() {
        this.model.on('update', this.scheduleDOMUpdate.bind(this));
    }

    scheduleDOMUpdate() {
        this.raf = requestAnimationFrame(this.updateDOM.bind(this));
    }

    updateDOM() {
        this.number.textContent = this.model.counter;
    }

}

window.customElements.define('counter-component', CounterComponent);

export default CounterComponent;