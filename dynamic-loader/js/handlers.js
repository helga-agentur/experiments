// Always use anonymous functions
(async () => {

    // If loaded through type=module, loading will be deferred and not ready at runtime
    const compareDocument = await import('./compareDocs.js');
    const handleNavigation = await import('./handleNavigation.js');    
    const handlePopState = await import('./handlePopState.js');
    const handleURLChange = await import('./handleURLChange.js');

    console.log('handlers.js');

    const init = () => {
        handlePopState.default();
        handleURLChange.default({
            beforeNavigation: animateIn,
            afterNavigation: animateOut,
            // Pass it in for now – TODO: Remove
            compareDocument: compareDocument.default,
        });
        const links = document.querySelectorAll('a');
        handleNavigation.default({ linkElements: links });
    }

    const animateIn = async() => {
        const animation = document.querySelector('.changeAnimation');
        animation.classList.add('in');
        return new Promise((resolve) => {
            animation.addEventListener('animationend', () => {
                animation.classList.remove('in');
                resolve();
            }, { once: true });
        });
    }

    const animateOut = () => {
        const animation = document.querySelector('.changeAnimation');
        animation.classList.add('out');
        animation.addEventListener('animationend', () => {
            animation.classList.remove('out');
        }, { once: true });
        setTimeout(updateHeader);
    }

    const updateHeader = () => {
        const header = document.querySelector('.header');
        const method = window.location.href.includes('about.html') ? 'add' : 'remove';
        header.classList[method]('aboutHeader');
    }

    init();
    console.log('init handlers');

})();