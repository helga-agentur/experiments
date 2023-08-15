import { gsap } from '../../node_modules/gsap/all.js';

class MidosModel extends HTMLElement {


    #values = {
        setup: {
            cameraTarget: '0 0 0',
            cameraOrbit: '45deg 45deg 120%',
            speed: 0.3,
        },
        cleaning: {
            cameraTarget: '0 1.5m 0.5m',
            cameraOrbit: '0deg 90deg 50%',
            speed: 0.7,
        },
        feeding: {
            cameraTarget: '0 -1m 1',
            cameraOrbit: '150deg 170deg 0',
            speed: 1,
        },
        performance: {
            cameraTarget: '0 0 0',
            cameraOrbit: '0 180deg 25%',
            speed: 0.3,
        },
    };

    #mv;


    connectedCallback() {

        this.#mv = document.querySelector('model-viewer');
        this.#mv.minFieldOfView = '10deg';
        this.#setupLoadListener();
        this.#setupScrollListener();

    }

    #setupLoadListener() {
        this.#mv.addEventListener('load', () => {
            const brightnessTimeline = gsap.timeline();
            brightnessTimeline.to(
                this.#mv,
                {
                    exposure: 1,
                    duration: 5,
                    ease: 'power4.inOut'
                },
            );
        });
    }


    #setupScrollListener() {

        window.addEventListener('sectionVisibility', ({ detail: { name } }) => {            
            const { cameraOrbit, cameraTarget, speed = 1 } = this.#values[name];
            this.#mv.interpolationDecay = 500 * speed;
            this.#mv.cameraTarget = cameraTarget;
            this.#mv.cameraOrbit = cameraOrbit;
        });
    
    }

}

if (!window.customElements.get('midos-model')) {
    window.customElements.define('midos-model', MidosModel);
}
