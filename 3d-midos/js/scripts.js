import { gsap } from '../../node_modules/gsap/all.js';
import Interactive3DModel from './Interactive3DModel';
import './StrongPoint.js';
import './StrongPointSection.js';

const setup = async() => {
    const container = document.querySelector('[data-3d-model-container]');

    const model = new Interactive3DModel();
    await model.setup({
        environmentPath: './model/moon_1k.hdr',
        modelPath: './model/MIDOS_complete.glb',
        width: container.offsetWidth,
        height: container.offsetHeight,
    });
    console.log('model ready');
    
    container.appendChild(model.getDomElement());
    
    // TODO: Add debounce
    window.addEventListener('resize', () => {
        model.setDimensions(container.offsetWidth, container.offsetHeight);
    });
    
    console.log(model.getCameraPosition());
    
    window.model = model;

    const timeline = gsap.timeline();

    // Structure must allow for multiple steps inbetween two entries to prevent the
    // camera from flying *through* the model. And it must be reversible.
    // TODO: Add lookAt
    const params = [{
            x: 2,
            y: 4,
            z: 3,
            name: 'setup',
        },
        {
            x: 0,
            y: 3.2,
            z: -2,
            name: 'cleaning',
        },
        {
            x: 0.2,
            y: -0.3,
            z: -0.5,
            name: 'feeding',
        },
        {
            x: 3,
            y: 1.5,
            z: -2,
        },
        {
            x: 0.01,
            y: 3,
            z: 0.01,
            name: 'performance',
        },
    ];

    let previousContent = 'setup';
    window.addEventListener('sectionVisibility', ({ detail: { name }}) => {

        timeline.clear();

        const previousIndex = params.findIndex((item) => item.name === previousContent);
        const currentIndex = params.findIndex((item) => item.name === name);

        const edges = params.slice(
            Math.min(previousIndex, currentIndex),
            Math.max(previousIndex, currentIndex) + 1,
        );
        if (previousIndex > currentIndex) edges.reverse();
        edges.splice(0, 1);

        const position = model.getCameraPosition();

        edges.forEach((edge, index) => {
            
            let easing = 'power2.inOut';
            if (edges.length === 2 && index === 0) {
                easing = 'power2.in';
            } else if (edges.length === 2 && index === 1) {
                easing = 'power2.out';
            } else if (edges.length > 2) {
                easing = 'linear';
            }
            
            const { name, ...coordinates } = edge;

            timeline.to(
                position,
                {
                    ...coordinates,
                    duration: 2 / edges.length,
                    ease: easing,
                    onUpdate: () => {
                        model.setCameraPosition(position);
                    },
                },
                '>',
            );    

        });

        previousContent = name;
    
    });

}

setup();