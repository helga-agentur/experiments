const button = document.querySelector('.btn');

button.addEventListener('mouseenter', (ev) => {
    const { offsetX, offsetY, currentTarget } = ev;
    const hoverButton = currentTarget.querySelector('.btn-hover');
    const { width, height } = hoverButton.getBoundingClientRect();
    const maxRadius = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
    const radius = maxRadius - Math.min(offsetX, width - offsetX);
    hoverButton.style.clipPath = `circle(0% at ${offsetX}px ${offsetY}px)`;
    setTimeout(() => {
        hoverButton.classList.add('animated');
        hoverButton.style.clipPath = `circle(${radius}px at ${offsetX}px ${offsetY}px)`;    
    }, 100);
});

button.addEventListener('mouseleave', (ev) => {
    const { offsetX, offsetY, currentTarget } = ev;
    const hoverButton = currentTarget.querySelector('.btn-hover');
    hoverButton.style.clipPath = `circle(0% at ${offsetX}px ${offsetY}px)`;
    const removeAnimated = () => {
        hoverButton.classList.remove('animated');
        hoverButton.removeEventListener('transitionend', removeAnimated);
    }
    hoverButton.addEventListener('transitionend', removeAnimated);
});