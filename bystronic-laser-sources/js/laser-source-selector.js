class LaserSourceSelector extends HTMLElement {

    #model;
    #id;

    connectedCallback() {
        this.#register();
        this.#setupViewListeners();
        this.#setupModelListeners();
        this.#updateModel();
    }

    #register() {
        this.dispatchEvent(new CustomEvent(
            'registerLaserSourceSelector',
            {
                bubbles: true,
                detail: {
                    setModel: this.#setModel.bind(this),
                },
            },
        ));
    }

    #setModel(model) {
        console.log('set laser source selector model to', model);
        this.#model = model;
    }

    #getInput() {
        return this.querySelector('input');
    }

    #getId() {
        // Only get the ID when we need it. We should indeed validate it.
        if (!this.#id) this.#id = this.dataset.laserSourceId;
        return this.#id;
    }

    /**
     * We should work on the naming: updateModel updates the model from the view while setModel
     * sets the (private) property to the model passed. This might be confusing, maybe use
     * storeModel to store the model.
     */
    #updateModel() {
        const isChecked = this.#getInput().checked;
        this.#model.updateLaserSourceFilter(this.#getId(), isChecked);
    }

    #setupViewListeners() {
        this.addEventListener('change', this.#updateModel.bind(this));
    }

    /**
     * Update view when model changes – not absolutely necessary but good to make sure that the
     * UI is in sync with the model (remember: the model knows the truth).
     */
    #setupModelListeners() {
        this.#model.on('changeLaserSourcesFilter', () => {
            const checked = this.#model.laserSourcesFilter.includes(this.#getId());
            console.log('update checked state on checkbox to', checked);
            this.#getInput().checked = checked;
        });
    }

}

if (!window.customElements.get('laser-source-selector')) {
    window.customElements.define('laser-source-selector', LaserSourceSelector);
}