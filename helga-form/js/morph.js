import gsap from '../../node_modules/gsap/all.js';


/**
 * Visually morphs a HTML element into another element. Does so by cloning fromElement, appending
 * it to document.body (after cleaning name/id and setting position: fixed) and then updating
 * top, left and morphProperties during the given duration.
 * @param {HTMLElement} fromElement    Element to morph from
 * @param {HTMLElement} toElement      Element to morph to
 * @param {Object} additional
 * @param {string[]} additional.morphProperties     Additional properties to morph (in addition to
 *                                                  top and left; use camelCase, e.g. 
 *                                                  'backgroundColor')
 * @param {number} additional.duration              Duration of the morph animation in seconds
 * @param {function} additional.callback            Function to be called when animation ends
 * @returns {GSAP.Tween}
 */
export default (
    fromElement,
    toElement,
    {
        duration = 1,
        morphProperties = [],
        callback = () => {},
    } = {}
) => {

    const morphingElementParent = document.body;
    const { left: fromLeft, top: fromTop } = fromElement.getBoundingClientRect();
    const { left: toLeft, top: toTop } = toElement.getBoundingClientRect();

    const clone = fromElement.cloneNode();
    
    // id and name: See warning https://developer.mozilla.org/en-US/docs/Web/API/Node/cloneNode
    clone.removeAttribute('id');
    clone.removeAttribute('name');
    clone.style.position = 'fixed';
    morphingElementParent.appendChild(clone);

    /**
     * Create an object that contains all values of toElement for the properties given in
     */
    const getAdditionalProperties = (element, properties) => {
        const computedStyles = window.getComputedStyle(element);
        return properties.reduce((propertyMap, propertyName) => (
            { ...propertyMap, [propertyName]: computedStyles[propertyName] }
        ), {});
    };

    // We do also store fromProperties explicityl at this moment so that they can be modified
    // on the original element from the outside afterwards
    const additionalToProperties = getAdditionalProperties(toElement, morphProperties);
    const additionalFromProperties = getAdditionalProperties(fromElement, morphProperties);

    return gsap.fromTo(
        clone,
        {
            left: fromLeft,
            top: fromTop,
            ...additionalFromProperties,
        },
        {
            data: { morphElement: clone },
            left: toLeft,
            top: toTop,
            ...additionalToProperties,
            duration,
            ease: 'power4.inOut',
        }
    );

}

