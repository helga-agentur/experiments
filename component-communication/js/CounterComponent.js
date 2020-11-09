import CounterModel from './CounterModel.js';
import canReceiveRegistrations from './containsModel.js';
import canScheduleDOM from './updateDOM.js';

class CounterComponent extends HTMLElement {

    constructor() {
        super();
        this.model = new CounterModel();
        this.number = this.querySelector('.number');
        Object.assign(
            this,
            canScheduleDOM(),
            canReceiveRegistrations({ eventTarget: this, eventName: 'register-element'}),
        );

        this.scheduleDOMUpdate();
        this.model.on('update', this.scheduleDOMUpdate.bind(this));
        this.listenToDependentComponents();

    }

    updateDOM() {
        this.number.textContent = this.model.counter;
    }

}

window.customElements.define('counter-component', CounterComponent);

export default CounterComponent;