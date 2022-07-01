document.addEventListener('DOMContentLoaded', () => {
    console.log('Ready');
});


class Component extends HTMLElement {
}

if (!window.customElements.get('component')) {
    window.customElements.define('component', Component);
}