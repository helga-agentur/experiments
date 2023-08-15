import { gsap } from '../../node_modules/gsap/all.js';
import { ScrollTrigger } from '../../node_modules/gsap/ScrollTrigger.js'


gsap.registerPlugin(ScrollTrigger);


const tasks = document.querySelectorAll('.task');
const illustrationContainer = document.querySelector('.illustrationContainer');

const imageTemplate = [...tasks].map((_, taskIndex) => (
    Array.from({ length: 3 }).map((_, imageIndex) => (
        `<img class='illustration' src='img/flipbook/${taskIndex + 1}-${imageIndex + 1}.jpeg' />`
    ))
));
illustrationContainer.innerHTML = imageTemplate.flat().join('');

// Read from DOM only once
const images = [...illustrationContainer.children];

// Make sure we only update the image's src attribute once. By default, the first image is
// visible.
let latestIllustration = images.at(0);
let rocketFlying = false;

[...tasks].forEach((taskElement, taskIndex) => {
    ScrollTrigger.create({
        trigger: taskElement,
        start: 'top center',
        // start: (self) => {
        //     const paddingBottom = parseFloat(
        //         window.getComputedStyle(self.vars.trigger).paddingBottom
        //     );
        //     const height = self.vars.trigger.offsetHeight;
        //     return `top center-=${(height - paddingBottom) / 2 }`
        // },
        end: 'bottom center',
        // end: 'bottom center',
        markers: true,
        // pin: true,
        onUpdate: ({ progress }) => {
            // Switch to *next* task as soon as we have reached 100%.
            let currentTaskImage;
            if (progress < 0.75) currentTaskImage = 0;
            else if (progress < 0.875) currentTaskImage = 1;
            else currentTaskImage = 2;
            const currentImageIndex = taskIndex * 3 + currentTaskImage;
            console.log(taskIndex, currentTaskImage);
            const currentImage = images[currentImageIndex];
            if (latestIllustration !== currentImage) {
                latestIllustration.style.opacity = 0;
                currentImage.style.opacity = 1;
                latestIllustration = currentImage;
            }
            // Rocket: Fly!
            // TODO: set back to initial position if not visible any more
            if (taskIndex === tasks.length - 1 && currentTaskImage === 2 && !rocketFlying) {
                rocketFlying = true;
                gsap.to(
                    currentImage,
                    {
                        top: '-100vh',
                        left: '30vw',
                        ease: 'power2.in',
                        duration: 1.5,
                        rotate: '20deg',
                    },
                );
            }
        },
    });
});


// Gray to black to gray
[...tasks].forEach((taskElement, index) => {

    const defaultOpacity = 0;
    gsap.set(
        taskElement,
        {
            opacity: defaultOpacity,
            // y: 50,
            // filter: 'blur(5px)',
        }
    );

    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: taskElement,
            start: 'top bottom-=20vh',
            end: 'bottom top+=20vh',
            toggleActions: 'play reverse play reverse',
            scrub: 0.25,
        }, 
    });

    timeline
        .to(
            taskElement,
            { 
                opacity: 1,
                duration: 1,
                ease: 'power4.in',
                // y: 0,
                // filter: 'blur(0)',
            },
        )
        .to(
            taskElement,
            { 
                opacity: defaultOpacity,
                duration: 1,
                ease: 'power4.out',
                // y: -50,
                // filter: 'blur(5px)',
            },
            '>+=0.7',
        );
    
});

