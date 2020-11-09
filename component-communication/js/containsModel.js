/**
 * Mixin for components that contain a model
*/
export default ({ eventName, eventTarget, eventType, eventIdentifier } = {}) => {

    return {
        listenToDependentComponents: function() {
            eventTarget.addEventListener(eventName, (ev) => {
                const { detail } = ev;
                if (eventType && detail.type !== eventType) return;
                if (eventIdentifier && detail.identifier !== eventIdentifier ) return;
                const { element } = ev.detail;
                element.setModel(this.model);
            });
        },
        // TODO: Deregister
    }

};
