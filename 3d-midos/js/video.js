import { gsap } from '../../node_modules/gsap/all.js';
import { ScrollTrigger } from '../../node_modules/gsap/ScrollTrigger.js'

gsap.registerPlugin(ScrollTrigger)

const video = document.querySelector('video');
const scroller = document.querySelector('.scroller');

// Inspiration:
// https://greensock.com/forums/topic/32782-video-scroll-animation/

const timeline = gsap.timeline({
    defaults: { duration: 1 },
    scrollTrigger: {
      trigger: scroller,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true
    }
  });

  video.addEventListener('loadedmetadata', () => {
    timeline.fromTo(
        video,
        {
            currentTime: 0,
        },
        {
            currentTime: video.duration,
        }
    );
  });

