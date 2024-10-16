/**
 * Scrub function that smoothes a curve with values passed in in real time (e.g. by scrolling);
 * inspired by GSAP's scrub for ScrollTrigger.
 * @param {number} initialValue - The current progress value (at the time of initialization; if
 * the subject is e.g. visible 50%, use 0.5)
 * @param {number} slowingFactor - The factor by which to smooth the value; the smaller, the slower
 * the smoothing will be
 * @param {function} callback - The callback function to apply the updated value
 */
export default ({
    initialValue = 0,
    slowingFactor = 0.1,
    callback = console.log,
} = {}) => { 

    let requestedAnimationFrame;
    let currentValue = initialValue;
    let targetValue = initialValue;

    const scheduleNextTick = () => {
        if (!requestedAnimationFrame) requestedAnimationFrame = requestAnimationFrame(update);
    }

    const update = () => {
        requestedAnimationFrame = null;
        // Slow down the way to targetValue by multiplying the difference between the current
        // and the target value by a certain slowing factor
        currentValue = currentValue + (targetValue - currentValue) * slowingFactor;
        callback(currentValue);
        // Keep updating as long as the difference is > 1/1000 of progress.
        if (Math.abs(targetValue - currentValue) > 0.001) scheduleNextTick();
    }

    // Start the update logic (needed if initial value is not 0)
    scheduleNextTick();

    return (progress) => {
        targetValue = progress;
        scheduleNextTick();
    }

}