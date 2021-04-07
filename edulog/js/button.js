const button = document.querySelector('.btn');
button.addEventListener('mouseenter', (ev) => {
    const { width, height } = ev.target.getBoundingClientRect();
    const distances = {
        'left center': Math.abs(ev.offsetX),
        top: Math.abs(ev.offsetY),
        bottom: Math.abs(ev.offsetY - height),
        right: Math.abs(ev.offsetX - width),
    };
    console.log(distances);
    const entry = Object.entries(distances).reduce((prev, [key, value]) => {
        if (value < prev[1]) return [key, value];
        else return prev;
    });
    console.log(entry[0]);
    // button.style.transformOrigin = entry[0];
    button.style.setProperty('--entry-direction', entry[0]);
    button.classList.add('hover');
});

button.addEventListener('mouseleave', () => {
    button.classList.remove('hover');
})