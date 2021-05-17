/**
 * @param {string[]} observerIdentifiers     Names of events to handle (that are emitted by children)
 * @param {string} updateMethodName          Name of the update method in 
 */
const createObservable = (observerTypes) => ({

    handlers: new Map(),

    listenToRegistrations() {
        this.addEventListener('registerObserver', this.handleObserverRegistration.bind(this));
    },

    handleObserverRegistration(event) {
        const { type, callback } = event.detail;
        if (!type || !callback) throw new Error(`type or cb missing: ${type}, ${callback}`); // TODO
        if (!this.handlers.has(type)) this.handlers.set(type, []);
        this.handlers.get(type).push(callback);
    },

    listen() {
        observerTypes.forEach((type) => {
            this.addEventListener(type, this.handleEvent.bind(this));
        });
        this.listenToRegistrations();
    },

    handleEvent(event) {
        const { type, detail } = event;
        if (!this.handlers.has(type)) return;
        // TODO: Add optional handler
        // Maybe use method name convention? 'modifyUpdateLocationData'?
        // Maybe use fix function modifyData(type, data)?
        const modifiedDetail = (this.modifyData) ? this.modifyData(type, detail) : detail;
        console.log('moddetail is', this.modifiedDetail);
        this.handlers.get(type).forEach(handler => handler(type, modifiedDetail));
    },

});



/**
 * @param {string[]} observerTypes   E.g. ['updateLocation']   
 */
const createObserver = (observerTypes) => ({

    /**
     * Dispatches an event to register an observer for every type we're listening to
     */
    register() {
        observerTypes
            .map(type => ({
                bubbles: true,
                detail: {
                    type,
                    callback: this.update.bind(this),
                },
            }))
            .forEach(option => this.dispatchEvent(new CustomEvent('registerObserver', option)))
    },

    // just on child
    // update(type, data) {
    // },

    // // just on child
    // handleSomeEvent() {
    //     this.dispatchEvent(new CustomEvent('updateLocation', { bubbles: true, detail: 'bern' }));
    // }

});


export { createObservable, createObserver };
