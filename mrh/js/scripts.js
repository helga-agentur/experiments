let below = false;
const scrollHandler = () => {
    if (window.pageYOffset > 50 && !below) {
        below = true;
        requestAnimationFrame(() => {
            document.body.classList.add('scrolled');
        });
    }
    if (window.pageYOffset <= 50 && below) {
        below = false;
        requestAnimationFrame(() => {
            document.body.classList.remove('scrolled');
        });
    }
}
window.addEventListener('scroll', scrollHandler);