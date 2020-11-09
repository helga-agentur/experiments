// Assume h1 would be the logo
const h1 = document.querySelector('h1');
const { x, height } = h1.getBoundingClientRect();
// y offset for IntersectionObserver is the vertical center of the logo/h1
const offset = x + height / 2;

// Fire IntersectionObserver whenever the section changes.
const targets = document.querySelectorAll('section');

/**
 * Current and previous scrollPosition. Needed to know if we scroll up or down.
 * @type {array.<number>}    Array with [currentScorllPosition, previousScrollPosition]
 */
let scrollPositions = [0, 0];


/**
 * On scroll, get current scroll position and update scrollPositions with it.
 */
window.addEventListener('scroll', () => {
    scrollPositions = [window.scrollY, scrollPositions[0]];
});


const callback = (entries, observer) => {

    let currentSection;
    const isScrollingDown = scrollPositions[0] > scrollPositions[1];

    // If there is an element whose intersectionRect.y exactly matches offset, we just scrolled 
    // into it (from the bottom).
    const hasExactOffset = entries.find(entry => entry.intersectionRect.y === offset);
    // If intersectionRect.y is exactly 0, an element just scrolled out of view; get the following
    // one from DOM (but only if scrolling down; scrolling up is handled throiugh hasExactOffset)
    const isZero = entries.find(entry => entry.intersectionRect.y === 0 && entry.intersectionRect.bottom === 0);

    if (hasExactOffset) {
        currentSection = hasExactOffset.target;
    } else if (isZero && isScrollingDown) {
        currentSection = targets[Array.from(targets).indexOf(isZero.target) + 1];
    }

    if (!currentSection) return;
    const color = currentSection.dataset.color;
    requestAnimationFrame(() => h1.style.color = color);

};

const options = {
    rootMargin: `-${offset}px`,
    threshold: [0],
}


const observer = new IntersectionObserver(callback, options);
Array.from(targets).forEach((target) => {
    observer.observe(target);
});


