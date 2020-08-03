import CounterModel from './CounterButton.js';
import CounterComponent from './CounterComponent.js';

const add = document.querySelector('.add-button');
const remove = document.querySelector('.remove-button');

remove.addEventListener('click', (ev) => {
    const button = ev.target.parentNode.querySelector('counter-button');
    button.parentNode.removeChild(button);
});

add.addEventListener('click', (ev) => {
    const div = document.createElement('div');
    div.innerHTML = '<counter-button>Add <div class="result"></div></counter-button>';
    ev.target.parentNode.prepend(div.querySelector('counter-button'));
});