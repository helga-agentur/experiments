export default ({ beforeNavigation, afterNavigation, compareDocument } = {}) => {

    // urlchange is the custom event fired by handlePopState and handleNavigation to harmonize
    // forward and back navigation handling
    window.addEventListener(
        'urlchange',
        async (ev) => {
            const { url } = ev.detail;
            console.log('handle', url);
            const rawContent = await fetch(url);
            const content = await rawContent.text();
            const dom = createDOM(content);
            console.log(dom);
            if (beforeNavigation) await beforeNavigation();
            compareDocument(document, dom);
            if (afterNavigation) afterNavigation();
        },
        // Only listen/execute once. New handler will be added when other URL is loaded
        // and scripts are executed
        { once: true },
    );

}

const createDOM = (html) => {
    const doc = document.createElement('html');
    doc.innerHTML = html;
    return doc;
}

