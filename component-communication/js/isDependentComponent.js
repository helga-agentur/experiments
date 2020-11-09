export default ({ eventName, eventType, eventIdentifier } = {}) => {
    return {
        model: undefined,
        register: function() {
            const event = new CustomEvent(eventName, {
                bubbles: true,
                detail: {
                    element: this,
                    eventType,
                    eventIdentifier,
                },
            });
            // Short delay to make sure event listeners on parent elements (where the event bubbles
            // to) are ready
            setTimeout(() => this.dispatchEvent(event));
        },
        setModel: function(model) {
            this.model = model;
            this.onModelChange();
        }
    }
};

