import LaserSources from './LaserSources.mjs';

class LaserSourcesTable extends HTMLElement {

    #model = new LaserSources();

    connectedCallback() {
        this.#setupRegisterListeners();
    }

    #setupRegisterListeners() {

        this.addEventListener('registerProducitivtyValue', ({ detail: { data, setModel } }) => {
            console.log('got productivity value registration for', data);
            this.#model.addProductivityValue(data)
            setModel(data, this.#model)
        });

        this.addEventListener('registerMaterialSelector', ({ detail: { setModel } }) => {
            setModel(this.#model);
        });

        this.addEventListener('registerLaserSourceSelector', ({ detail: { setModel } }) => {
            setModel(this.#model);
        });

    }

}

if (!window.customElements.get('laser-sources-table')) {
    window.customElements.define('laser-sources-table', LaserSourcesTable);
}