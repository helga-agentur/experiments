

/*
const script = document.querySelector('script[src="js/testScript.js"]');
script.parentNode.removeChild(script);
const newScript = document.createElement('script');
newScript.setAttribute('src', 'js/testScript.js');
newScript.setAttribute('type', 'module');
document.body.appendChild(newScript);
*/



// Just see if constants cause errors
// const someConst = 5;

/*document.addEventListener('DOMContentLoaded', () => {
    init();
});*/
init();

function init() {
    document.querySelector('a').addEventListener('click', handleClick);
}

function getHeader(element) {
    return element.querySelector('.header');
}

function removeChangingChildren() {
    // Remove everything but header
    const header = getHeader(document);
    const toRemove = [];
    for (const child of document.body.childNodes) {
        if (child !== header) {
            toRemove.push(child);
        }
    }
    toRemove.forEach(element => element.parentNode.removeChild(element));
}

async function handleClick(ev) {
    ev.preventDefault();
    // removeChangingChildren();
    const url = ev.currentTarget.getAttribute('href');
    const rawContent = await fetch(url);
    const content = await rawContent.text();
    // Remove doctype
    const htmlContent = content.substring(content.indexOf('<html'));
    // console.log(document.querySelector('html'), htmlContent);
    const dom = createDOM(htmlContent);
    
    
    /* const dd = new diffDOM.DiffDOM({
        // debug: true,
        preDiffApply: function(info) {
            console.log(info);
            // Don't update .header
            if (info.node && info.node.nodeType === 1 && info.node.matches('.header')) {
                // if (info.diff.action === 'addElement') return true;
                console.log(info);
                // return true;
            }
        }
    });
    const diff = dd.diff(document.querySelector('html'), htmlContent);
    // console.log(diff);
    dd.apply(document.querySelector('html'), diff); */
}

function createDOM(html) {
    // const doc = document.implementation.createHTMLDocument(title)
    // const doc = new Document();
    const doc = document.createElement('html');
    doc.innerHTML = html;
    return doc;
}



function updateDocument(newDocument) {
    document.head.innerHTML = newDocument.querySelector('head').innerHTML;
    const beforeHeader = [];
    const afterHeader = [];
    let headerReached = false;
    const header = getHeader(newDocument);
    const newBody = newDocument.querySelector('body');
    for (const child of newBody.childNodes) {
        if (child === header) {
            headerReached = true;
            continue;
        }
        if (!headerReached) beforeHeader.push(child);
        else afterHeader.push(child);
    }
    beforeHeader.forEach(element => document.body.prepend(document.adoptNode(element, true)));
    afterHeader.forEach((element) => {
        if (element.nodeType === 1 && element.matches('script')) {
            console.log('script', element);
            const script = document.createElement('script');
            console.log(element.attributes);
            for (const attribute of element.attributes) {
                script.setAttribute(attribute.name, attribute.value);
            }
            document.body.appendChild(script);
        }
        else {
            document.body.append(document.adoptNode(element, true));
        }
    });
    //document.body.prepend(...beforeHeader);
    // document.body.append(...afterHeader);
    console.log('DONE');
}


console.log('executed');