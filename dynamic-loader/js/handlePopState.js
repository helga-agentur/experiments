export default () => {

    window.addEventListener('popstate', (ev) => {
        console.log('pop');
        window.dispatchEvent(new CustomEvent('urlchange', { detail: { url: ev.state.url } }));
    });

};
