/**
 * Listens to hash changes on parent window; propagates them to iframe
 */

function getFilterFromHash() {
    return window.location.hash.replace(/^#/, '');
}

function setIFrameFilter(iframe, initialSource, filter) {
    const newURL = `${initialSource}#${filter}`;
    // See https://stackoverflow.com/questions/2245883/browser-back-acts-on-nested-iframe-before-the-page-itself-is-there-a-way-to-av
    iframe.contentWindow.location.replace(newURL);
}


const iframe = document.querySelector('iframe');
const initialSource = iframe.getAttribute('src');

window.addEventListener('hashchange', () => {
    console.log('###', getFilterFromHash());
    setIFrameFilter(iframe, initialSource, getFilterFromHash());
});

// Update filters on initial load
if (getFilterFromHash()) {
    setIFrameFilter(iframe, initialSource, getFilterFromHash());
}

