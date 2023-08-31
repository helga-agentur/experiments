import "./ReferenceImage.js";
import splitText from '@joinbox/splittext';
import Joinimation from '@joinbox/joinimation';

[...document.querySelectorAll('h1, p')].forEach((element) => {
    console.log(element);
    // TODO: Don't split letters for paragraphs, only words
    const restore = splitText({
        element,
        wrapLetter: (content, index) => `<span class="letter" style="--letter-index: ${index}">${content}</span>`,
        wrapLine: (content, index) => `<div class="line" style="--line-index: ${index}">${content}</div>`,
        wrapWord: (content, index) => `<div class="word" style="--word-index: ${index}">${content}</div>`,
    });
});

const joinimation = new Joinimation();
joinimation.add(document.querySelector('body'));
