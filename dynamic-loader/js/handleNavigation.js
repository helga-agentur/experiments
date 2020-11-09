import once from './once.js';

export default ({
    linkElements,
    checkLink,
}) => {

    if (typeof checkLink !== 'function') {
        // TODO: Handle gracefully, function is essential
    }

    for (const element of linkElements) {
        console.log('listen', element);
        // As this function might be called on a site with elements that 
        once(element, 'click-handler-added', () => {
            console.log('add listener');
            element.addEventListener('click', (ev) => {
                const href = ev.currentTarget.getAttribute('href');
                console.log('go to', href);
                // Don't handle link if filterLinks returns falsy value for the given url
                if (checkLink && !checkLink(url)) return;
                ev.preventDefault();
                updateState(href);
            });
        });
    }

}

const updateState = (url) => {
    // Update state; does not have any direct effect, but is needed if user reloads or navigates
    // back
    history.pushState({ url }, '', url);
    // Fire urlchange event; same will be done with popstate to harmonize url change behavior
    window.dispatchEvent(new CustomEvent('urlchange', { detail: { url } }));
}