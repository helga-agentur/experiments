import readAttribute from './readAttribute.mjs';
import { gsap } from './gsap/all.js';
import { ScrollTrigger } from './gsap/ScrollTrigger.js'

gsap.registerPlugin(ScrollTrigger);


const createStickyRotatingCylinder = (element, totalRotation) => {

    // gsap.set(
    //     element,
    //     {
    //         opacity: 0.3,
    //     },
    // );

    gsap.set(element, {rotationX: -80});
    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: ".home-clients__wrapper",
            markers: true,
            start: 'top center',
            end: 'bottom center',
            toggleActions: 'play reverse play reverse',
            scrub: 1,
            // pin: true,
        },
        defaults: {
            duration: 1,
        },
    });
    // console.log('bla');
    // console.log(totalRotation / Math.PI * 180);
    // console.log('hier');
    timeline
        .fromTo(
            element,
            {
                rotationX: -80,
            },
            {
                rotationX: 270 ,
            }
        );

/*    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: element,
            markers: true,
            start: 'middle-=150% center',
            end: 'middle+=150% center',
            toggleActions: 'play reverse play reverse',
            scrub: 0.5,
        },
        defaults: {
            duration: 1,
        },
    });

    timeline
    .to(
        content,
        {
                rotationX: 0,
                opacity: 1,
            },
        )
        .to(
            content,
            {
                rotationX: 90,
                opacity: 0.3,
                y: '-20%',
            },
        );*/

};


const elements = [...document.querySelectorAll('li')];
// elements.forEach((element) => createTimeline(element));

const getElementHeightWithMargin = (element) => {
    const { marginTop, marginBottom } = window.getComputedStyle(element);
    return element.offsetHeight + parseFloat(marginTop) + parseFloat(marginBottom);
}

// Rotate every element by 40°
const elementsHeight = elements.reduce((sum, item) => (
    sum + getElementHeightWithMargin(item)
), 0);
console.log('totalHeight', elementsHeight);

const ul = document.querySelector('ul');
// ul.style.height = `${elementsHeight}px`;

// Circle should fill 50vh. If height of all elements is larger, make sure all elements fit
// around the circle.
const circumference = Math.max(window.innerHeight * Math.PI / 2, elementsHeight);
const radius = Math.round(circumference / Math.PI / 2);
console.log('radius', radius);

// Circumference that will be filled with content
const filledCircumference = elementsHeight / circumference;

// How many elements would fit if the circle was completely filled?
const partsPerCircle = elements.length / filledCircumference;
console.log('parts', partsPerCircle);

const rotationPerPx = Math.PI * 2 / circumference;
console.log('rotPerPx', rotationPerPx / Math.PI * 180, 'wholeCircle', rotationPerPx * circumference / Math.PI * 180);

elements.reduce((previousHeights, element) => {
    // Rotate backwards … form 360° towards 300°
    const rotation = Math.PI * 2 - (rotationPerPx * previousHeights);
    // translateZ translates perpendicularily to the surface of the (rotated) element
    const height = getElementHeightWithMargin(element);
    console.log(height);
    // element.style.transform = `rotateX(${(rotation)}rad) translateZ(${radius}px)`;
    console.log('prevHeights', previousHeights);
    return previousHeights + height;
}, 0);

// ul.style.transform = `translateZ(-${radius}px)`;

createStickyRotatingCylinder(ul, rotationPerPx * elementsHeight);
