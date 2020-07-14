/**
 * Listens to hashchange event on window; writes hash to .parameters element.
 */

const parameterContainer = document.querySelector('.parameters');

window.addEventListener('hashchange', () => {
    const parameters = window.location.hash;
    requestAnimationFrame(() => {
        parameterContainer.innerHTML = parameters;
    });
});

requestAnimationFrame(() => {
    parameterContainer.innerHTML = window.location.hash;
});
