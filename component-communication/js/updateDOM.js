export default () => ({
    scheduleDOMUpdate: function() {
        if (this.raf) return;
        this.raf = requestAnimationFrame(this.triggerDOMUpdate.bind(this));
    },
    triggerDOMUpdate: function() {
        this.raf = null;
        if (typeof this.updateDOM !== 'function') {
            throw new Error(`updateDOM: Function updateDOM is not defined or not a function in the component that uses the mixin; is ${this.updateDOM} instead.`);
        }
        this.updateDOM();
    },
});
