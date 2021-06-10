/**
 * @param {string[]} observerIdentifiers    Names of events to handle (that are emitted by children)
 * @param {function} modifyEventData        Function that updates event data before it is sent
 *                                          to observers
 */

// Use symbols as property/method names to not expose them to «child» classes
const listenToRegistrations = Symbol('listenToRegistrations');
const handleObserverRegistration = Symbol('handleObserverRegistration');
const handleEvent = Symbol('handleEvent');
const handlers = Symbol('handlers');

const createObservable = ({ observerTypes, modifyEventData = data => data } = {}) => ({

    /**
     * Bsp:
     * new Map([
     * ['updateLocation', [fn(), fn()]]
     * ])
     */
    [handlers]: new Map(),

    [listenToRegistrations]() {
        this.addEventListener('registerObserver', this[handleObserverRegistration].bind(this));
    },

    [handleObserverRegistration](event) {
        const { type, callback } = event.detail;
        if (!type || !callback) throw new Error(`type or cb missing: ${type}, ${callback}`); // TODO
        if (!this[handlers].has(type)) this[handlers].set(type, []);
        this[handlers].get(type).push(callback);
    },

    listen() {
        observerTypes.forEach((type) => {
            this.addEventListener(type, this[handleEvent].bind(this));
        });
        this[listenToRegistrations]();
    },

    [handleEvent](event) {
        const { type, detail } = event;
        if (!this[handlers].has(type)) return;
        this[handlers].get(type).forEach(handler => handler(type, modifyEventData(type, detail)));
    },

});



/**
 * @param {string[]} observerTypes   E.g. ['updateLocation']   
 */
const createObserver = ({ observerTypes, updateFunction } = {}) => ({

    /**
     * Dispatches an event to register an observer for every type we're listening to
     */
    register() {
        observerTypes
            .map(type => ({
                bubbles: true,
                detail: {
                    type,
                    callback: updateFunction,
                },
            }))
            .forEach(option => this.dispatchEvent(new CustomEvent('registerObserver', option)))
    },

});


export { createObservable, createObserver };
