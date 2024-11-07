const showLogs = window.location.hash.includes('debug-wheel');
const log = (...args) => {
    if (showLogs) console.log(...args);
}

/**
 * Holds the configuration for one spin; use a class to bundle things that belong together.
 */
class SpinningConfiguration {
    initialSpeed;
    accelerationFactor;
    startTime;
    constructor({ initialSpeed, accelerationFactor, startTime }) {
        this.initialSpeed = initialSpeed;
        this.accelerationFactor = accelerationFactor;
        this.startTime = startTime;
    }
}


/**
 * Just a wheel of fortune with a configurable chance of winning.
 * Needs a child element with a data-wheel attribute that will be rotated.
 * @attribute {number} data-winning-probability - Number between 0 (will never win) and 1 (will
 * always win)
 */
export default class WheelOfFortune extends HTMLElement {

    #winningProbability;

    /**
     * Number of winning and non-winning segments per wheel; we assume that they all have the
     * same size.
     * @type {number}
     */
    #segmentsPerWheel = 8;

    /**
     * Define if the first segment (starting at angle 0) is a winning segment.
     * @type {boolean}
     */
    #startsWithWinningSegment = false;

    /**
     * How fast shall we slow down the wheel?
     * @type {number}
     */
    #accelerationFactor = -180;

    /**
     * Holds the wheel element to improve performance.
     * @type {HTMLElement}
     */
    #wheel;

    /**
     * Holds an instance of SpinningConfiguration, but only while the wheel is spinning.
     * @type {SpinningConfiguration}
     */
    #spinningConfiguration;

    #getWinningProbability() {
        if (!this.#winningProbability) {
            const rawProbability = this.getAttribute('data-winning-probability');
            this.#winningProbability = parseFloat(rawProbability);
            if (Number.isNaN(this.#winningProbability)) {
                throw new Error(`Attribute data-winning-probability must be a number, is ${rawProbability} instead`);
            }
        }
        log('Winning probability is %o', this.#winningProbability);
        return this.#winningProbability;
    }

    /**
     * Calculates where the wheel should stop spinning (depending on the winning probability).
     * @returns {number}
     */
    #calculateTotalRotation() {
        const isWinner = Math.random() < this.#getWinningProbability();
        log('Will be a winner? %o', isWinner);
        // 50% of segments are winning, 50% losing
        let finalPositionInDeg = Math.random() * 360;
        log('Non-adjusted final position: %o', finalPositionInDeg);
        // Let's be supersmart here: If the final position does not match isWinning, just rotate
        // by a segment 🤯🤣 
        if (this.#isPositionWinning(finalPositionInDeg) !== isWinner) {
            log('Adjust final position to account for winning probability');
            finalPositionInDeg += this.#degreesPerSegment;
        }
        log('Adjusted final position: %o', finalPositionInDeg);
        const wholeTurns = 3 + Math.ceil(Math.random() * 2);
        const totalRotation = wholeTurns * 360 + finalPositionInDeg;
        log('Total rotation in degrees: %o', totalRotation);
        return totalRotation;
    }

    /**
     * Gets the initial speed of the wheel
     * @param {number} param0.distance - Total distance the wheel has to travel
     * @param {number} param0.spinTime - Time it takes for the wheel to stop spinning
     * @returns {number}
     */
    #calculateInitialSpeed({ distance }) {
        // v = sqrt(v0^2 + 2 *a * d); v0 is 0.
        // Thereby we get the end speed. As our *end* speed is 0 and we want to get the start
        // speed, we just invert everything and use the end speed as start speed.
        return Math.sqrt(2 * Math.abs(this.#accelerationFactor) * distance);
    }

    /**
     * Returns if a certain position is a win or not
     * @param {number} position - Position in deg
     * @returns {boolean}
     */
    #isPositionWinning(position) {
        // We turn clockwise; if the first segment is 45° wide and winning, and when we turn by
        // 20°, the current segment will be losing (as the last segment will be at the top)
        const winningSegmentStartAngle = this.#startsWithWinningSegment 
            ? this.#degreesPerSegment
            : 0;
        log('Winning segment start angle', winningSegmentStartAngle);
        // Remove all previous segments to get an angle between 0 and 2 segments (one winning,
        // one losing)
        const zeroBasedPosition = position % (this.#degreesPerSegment * 2)
        const isWinning = zeroBasedPosition >= winningSegmentStartAngle &&
            zeroBasedPosition < winningSegmentStartAngle + this.#degreesPerSegment;
        log('Is position %d winning? %o', position, isWinning);
        return isWinning;
    }

    /**
     * Returns the width of a segment in degrees
     * @returns {number}
     */
    get #degreesPerSegment() {
        return 360 / this.#segmentsPerWheel;
    }

    spin() {
        // Wheel is already spinning: Just return.
        if (this.#spinningConfiguration) return;
        this.#getWheel().style.rotate = 'none';
        const totalRotation = this.#calculateTotalRotation();
        const initialSpeed = this.#calculateInitialSpeed({ distance: totalRotation });
        // Store config for the current spin; this also defines that a spin is happening: users
        // can't restart the while while it is spinning.
        this.#spinningConfiguration = new SpinningConfiguration({
            initialSpeed,
            accelerationFactor: this.#accelerationFactor,
            startTime: Date.now(),
        });
        log('Initial speed: %o', initialSpeed);
        requestAnimationFrame(this.#animate.bind(this));
    }

    /**
     * @returns {HTMLElement}
     */
    #getWheel() {
        if (!this.#wheel) {
            this.#wheel = this.querySelector('[data-wheel]');
            log('Get wheel %o', this.#wheel);
            if (!this.#wheel) {
                throw new Error('Child element that matches selector data-wheel not found');
            }
        }
        return this.#wheel;
    }

    #animate() {
        const wheel = this.#getWheel();
        const currentTime = Date.now();
        const timePassed = (currentTime - this.#spinningConfiguration.startTime) / 1000;
        // v = v0 + at
        const currentSpeed = this.#spinningConfiguration.initialSpeed +
            this.#spinningConfiguration.accelerationFactor * timePassed;
        // s = v0 * t + (1/2)a * t^2
        const currentPosition = this.#spinningConfiguration.initialSpeed * timePassed +
            0.5 * this.#spinningConfiguration.accelerationFactor * (timePassed ** 2);
        wheel.style.transform = `rotate(${currentPosition}deg)`;
        if (currentSpeed > 0) {
            requestAnimationFrame(this.#animate.bind(this));
        } else {
            log('Done after %o s; current position %o', timePassed, currentPosition);
            // Recalculate if position is winning or not (and don't take the initial value) in
            // order to make absolutely sure that the view corresponds to the value.
            const endPositionIsWinning = this.#isPositionWinning(currentPosition);
            this.dispatchEvent(new CustomEvent('spinEnd', {
                detail: {
                    isWinning: endPositionIsWinning,
                },
                bubbles: true,
            }));
            this.#spinningConfiguration = null;
        }
    }

    static defineCustomElement() {
        if (!window.customElements.get('wheel-of-fortune')) {
            window.customElements.define('wheel-of-fortune', WheelOfFortune);
        }
    }
}
