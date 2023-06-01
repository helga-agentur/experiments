class MaterialSelector extends HTMLElement {

    #model;

    connectedCallback() {
        this.#register();
        this.#setupViewListeners();
        // Make sure initial status is synced to the model
        this.#updateModel();

    }

    #register() {
        this.dispatchEvent(new CustomEvent(
            'registerMaterialSelector',
            {
                bubbles: true,
                detail: {
                    setModel: this.#setModel.bind(this),
                },
            },
        ));
    }

    #setModel(model) {
        console.log('set material selector model to', model);
        this.#model = model;
    }

    #updateModel() {
        const currentValue = this.querySelector('select').value;
        this.#model.setMaterialsFilter(currentValue);
    }

    #setupViewListeners() {
        this.addEventListener('change', this.#updateModel.bind(this));
    }

}

if (!window.customElements.get('material-selector')) {
    window.customElements.define('material-selector', MaterialSelector);
}