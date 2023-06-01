class ProductivityValue extends HTMLElement {

    #model;
    #laserSourcesModel;

    connectedCallback() {
        this.#register();
        this.#setupModelListeners();
        // Make sure view is updated initially in order to be in sync with the model
        this.#updateView();
    }

    #register() {
        // Create data object from element properties
        const data = ['value', 'materialId', 'laserSourceId', 'thickness'].reduce((prev, prop) => (
            { ...prev, [prop]: this.dataset[prop]}
        ), {});
        ['value', 'thickness'].forEach((prop) => data[prop] = parseFloat(data[prop]));
        console.log('register productivity value', data);
        this.dispatchEvent(new CustomEvent(
            'registerProducitivtyValue', 
            {
                bubbles: true,
                detail: {
                    data,
                    setModel: this.#setModel.bind(this),
                }
            },
        ));
    }

    #setModel(productivityValue, laserSources) {
        this.#model = productivityValue;
        this.#laserSourcesModel = laserSources;
        console.log('set producitivity value models to', this.#model, this.#laserSourcesModel)
    }

    #setupModelListeners() {
        this.#laserSourcesModel.on('changeLaserSourcesFilter', this.#updateView.bind(this));
        this.#laserSourcesModel.on('changeMaterialFilter', this.#updateView.bind(this));
    }

    #updateView() {
        this.hidden = !this.#model.isVisible;
        this.innerHTML = `<strong>${Math.floor(this.#model.relativeValue * 100)}%</strong> (orig. ${this.#model.value}) (width ${Math.floor(this.#model.relativeWidth * 100)}%)`;
    }

}

if (!window.customElements.get('productivity-value')) {
    window.customElements.define('productivity-value', ProductivityValue);
}