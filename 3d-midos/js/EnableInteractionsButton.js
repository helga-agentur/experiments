class EnableInteractionsButton extends HTMLElement {

    #interactionsEnabled;
    #enableInteractionsText;
    #disableInteractionsText;

    connectedCallback() {
        this.#setupClickListener();
        this.#enableInteractionsText = this.querySelector('[data-enable-text]');
        this.#disableInteractionsText = this.querySelector('[data-disable-text]');
        this.#interactionsEnabled = this.#disableInteractionsText.hasAttribute('hidden');
    }

    #setupClickListener() {
        this.addEventListener('click', () => {
            this.#toggle();
        });
    }

    #toggle() {
        this.#interactionsEnabled = !this.#interactionsEnabled;
        // Diiiiirty
        const mv = document.querySelector('model-viewer');
        mv.interpolationDecay = 50;
        mv.cameraControls = !this.#interactionsEnabled;
        mv.interactionPrompt = !this.#interactionsEnabled;
        mv.interactionPromptThreshold = 0;
        mv.cameraTarget = '0 0 0';
        this.#updateView();
    }

    #updateView() {
        this.#enableInteractionsText.toggleAttribute('hidden', !this.#interactionsEnabled);
        this.#disableInteractionsText.toggleAttribute('hidden', this.#interactionsEnabled);

    }

}

if (!window.customElements.get('enable-interactions-button')) {
    window.customElements.define('enable-interactions-button', EnableInteractionsButton);
}