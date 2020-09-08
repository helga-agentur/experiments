const circleOptions = {
    threshold: 1,
    rootMargin: `${window.innerHeight * -0.1 }px`,
}
const circleObserver = new IntersectionObserver(circleCallback, circleOptions);
const circleTargets = document.querySelectorAll('[data-circle]');
for (const target of circleTargets) {
    circleObserver.observe(target);
}

const circle = document.querySelector('.circle');

function circleCallback(elements) {
    // Just get the first newly visible element to position circle
    console.log(elements);
    const visibleCircles = elements.filter(element => element.isIntersecting && element.target.matches('[data-circle]'));
    console.log('Visible %o', visibleCircles);
    if (visibleCircles.length) positionCircle(visibleCircles[0].target);
}

function positionCircle(element) {
    console.log('Position at %o', element);
    const css = element.dataset.circleCss || '{}';
    console.log('Circle CSS %o', css);
    const parsedCSS = JSON.parse(css);
    const rect = element.getBoundingClientRect();
    console.log('Rect is %o', rect);
    const left = rect.left + window.scrollX;
    const top = rect.top + window.scrollY;
    console.log(top, left);
    const defaultTransform = `translate3d(${left}px, ${top}px, 0)`;
    const properties = {
        ...parsedCSS,
        transform: [...(parsedCSS.transform ? [parsedCSS.transform] : []), defaultTransform].join(' '),
    }
    console.log(properties);
    requestAnimationFrame(() => {
        for (const key in properties) {
            circle.style[key] = properties[key];
        }
    });
}







const pagesOptions = {
    threshold: 0.2,
    rootMargin: `${window.innerHeight * -0.2}px`,
}
const pagesObserver = new IntersectionObserver(pagesCallback, pagesOptions);
const pagesTargets = document.querySelectorAll('.page');
for (const target of pagesTargets) {
    pagesObserver.observe(target);
}

function pagesCallback(pages) {
    console.log(pages);
    // Just get the first newly visible element to position circle
    updatePages(pages.filter(page => page.isIntersecting).map(item => item.target), 'add');
    updatePages(pages.filter(page => !page.isIntersecting).map(item => item.target), 'remove');
}

function updatePages(pages, method) {
    console.log('Update %o with %s', pages, method);
    requestAnimationFrame(() => {
        for (const page of pages) {
            console.log(page);
            page.classList[method]('visible');
        }
    });
}

