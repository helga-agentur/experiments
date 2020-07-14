/**
 * Listens to message event, updates URL of iframe accordingly
 */

 window.addEventListener('message', (ev) => {
    const filter = ev.data;
    console.log('Got message with data %o', filter);
    // Propagate state to our own (parent window) URL to enable forward/back navigation
    window.location.hash = filter;
});
