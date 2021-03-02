const blue = document.querySelector('.blue');

const run = () => {

    requestAnimationFrame(() => {
        blue.classList.add('visible');
    });

    setTimeout(() => {
        requestAnimationFrame(() => {
            blue.classList.add('hidden');
            blue.classList.remove('visible');
        });
    }, 3000);

    /* out-timeout plus 1.s for all transitions */
    setTimeout(() => {
        requestAnimationFrame(() => {
            blue.classList.remove('hidden');
        });
        setTimeout(run, 100);
    }, 5000)

}

setTimeout(run, 1000);
