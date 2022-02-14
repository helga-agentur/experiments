/* Copied from our projects */
const debounce = (callback, delay) => {
    let timeout;

    return () => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(callback, delay);
    };
};





/**
* Measures an elements dimensions on init and window resize (after debounce), calls the provided
* callback function on change.
* @param {HTMLElement} element              Element to measure
* @param {function} callback                Function to call with the element's dimensions
*                                           whenever they change. Argument is an instance of
*                                           DOMRect (see https://developer.mozilla.org/en-US/docs/Web/API/DOMRect)
* @param {number|false} resizeDebounceInMs  Debounce after a window resize in ms; use 0 for no
*                                           debounce at all (callback is directly called). Use
*                                           false if callback should not be called on window resize.
* @returns {function}                       Function that tears down all listeners (currently
                                            window resize if resizeDebounceInMs is not false)
*/
const measureElement = ({ element, callback, resizeDebounceInMs = 200 } = {}) => {
    if (!element instanceof HTMLElement) {
        throw new Error(`Argument \'element\' is required and must be an instance of an HTMLElement; you passed ${JSON.stringify(element)} instead.`);
    }
    if (typeof callback !== 'function') {
        throw new Error(`Argument \'callback\' is required and must be a function; you passed ${JSON.stringify(callback)} instead.`);
    }
    if (resizeDebounceInMs !== false && typeof resizeDebounceInMs !== 'number') {
        throw new Error(`Argument \'resizeDebounceInMs\' must be false (if dimensions should not be updated on resize) or a number (with the debounce timeout in ms); you passed ${JSON.stringify(resizeDebounceInMs)} instead.`);
      
    }

    // Measure element on init
    callback(executeMeasure({ element }));

    // We always return a function (to prevent users from unnecessary type checking).
    // Therefore if no resize listener is used, we return an "empty" function.
    let removeWindowResizeEventListener = () => {};

    if (resizeDebounceInMs !== false) {
        const debouncedMeasureFunction = debounce(
            () => callback(executeMeasure({ element })),
            resizeDebounceInMs,
        );
        window.addEventListener('resize', debouncedMeasureFunction);
        removeWindowResizeEventListener = () => window.removeEventListener(
            'resize',
            debouncedMeasureFunction,
        );
    }
    return removeWindowResizeEventListener;
  
}

const executeMeasure = ({ element } = {}) => element.getBoundingClientRect();




// Test
const unset = measureElement({
  element: document.querySelector('.test'),
  callback: ({ height, width }) => {
    console.log(height, width);
  },
});

setTimeout(() => {
  unset();
  console.log('unset');
}, 5000);
