/**
 * Adds click listener to buttons. Dispatches postMessage with button's data-filter attribute
 * on click.
 */

const buttons = document.querySelectorAll('button');
Array.from(buttons).forEach((button) => {
    addClickListener(button);
});

function addClickListener(button) {
    button.addEventListener('click', handleClick);
}

function handleClick(event) {
    const origin = event.target;
    const { filter }  = origin.dataset;
    console.log('Post message %o', filter);
    window.parent.postMessage(filter);
}
