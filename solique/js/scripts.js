document.addEventListener('DOMContentLoaded', () => {
    console.log('Ready');
});

const iframe = document.querySelector('iframe');
console.log(iframe);
window.addEventListener('message', (ev) => {
    console.log(ev.data);
    if (ev.data && ev.data.height) {
        iframe.style.height = `${ev.data.height}px`;
    }
});

