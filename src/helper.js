
/**
 * This constant is one possible option for the deltaMode property of a wheel event.
 * This deltaMode measures the delta values in pixels.
 *
 * @type {number}
 */
const DOM_DELTA_PIXEL = (window.WheelEvent && window.WheelEvent.DOM_DELTA_PIXEL) || 0x00;

/**
 * This constant is one possible option for the deltaMode property of a wheel event.
 * This deltaMode measures the delta values in lines.
 *
 * @type {number}
 */
const DOM_DELTA_LINE = (window.WheelEvent && window.WheelEvent.DOM_DELTA_LINE) || 0x01;

/**
 * This constant is one possible option for the deltaMode property of a wheel event.
 * This deltaMode measures the delta values in pages.
 *
 * @type {number}
 */
const DOM_DELTA_PAGE = (window.WheelEvent && window.WheelEvent.DOM_DELTA_PAGE) || 0x02;

/**
 * This constant tells the browsers line height for one line. This is used for calculating the distance
 * to scroll in a wheel event
 *
 * @type {number}
 */
const browsersLineHeight = window.parseInt(
    window
        .getComputedStyle(document.querySelector('html'), null)
        .getPropertyValue('font-size'), 10) || 16;

/**
 * This applies the given options to the scrollbar elements
 *
 * @param {Element} aElement The scrollbar element to apply the options to
 * @param {string} aElementName The element name (xElement and yElement) to create the options read propertys from
 * @param {Object} aOptions The options to read from
 */
export function applyOptionsToScrollBarElement(aElement, aElementName, aOptions) {
    // first create the option keys, that should get read
    const stylesKey = `${aElementName}Styles`;
    const classKey = `${aElementName}Class`;
    const element = aElement;

    // then go for the style key and apply it to the element
    if (aOptions && aOptions[stylesKey] && typeof aOptions[stylesKey] === 'object' &&
        !Array.isArray(aOptions[stylesKey])
    ) {
        Object.keys(aOptions[stylesKey]).forEach((aKey) => {
            // here we need to disable the param reassign, because we want to make clear where we write to
            element.style[aKey] = aOptions[stylesKey][aKey];
        });
    }

    // then apply the classes to the elements
    if (aOptions && typeof aOptions[classKey] === 'string') {
        element.className += ` ${aOptions[classKey]}`;
    }
    else if (aOptions && Array.isArray(aOptions[classKey])) {
        element.className += ` ${aOptions[classKey].join(' ')}`;
    }
}

/**
 * Debounces given callback by given waittime. No arguments will be passed through
 *
 * @param {Function} aCallback The callback to call debounced
 * @param {number} aWaitTime The time to wait till calling the callback
 * @return {Array.<Function>} An array with two functions. The first is the debounced callback,
 * the second is a destroy callback
 */
export function debounce(aCallback, aWaitTime) {
    let pointer = null;

    return [
        () => {
            window.clearTimeout(pointer);
            pointer = window.setTimeout(aCallback, aWaitTime);
        },
        () => {
            window.clearTimeout(pointer);
        },
    ];
}

/**
 * This function calculates the distance to scroll in pixel, based on given information from the
 * scroll event.
 *
 * @param {boolean} aIsX
 * @param {number|undefined} aDeltaOption
 * @param {number} aDeltaMode
 * @param {number} aDeltaValue
 * @param {Element} aScrollContainer
 * @return {number} The calculated distance to scroll
 */
export function getWheelDeltaAsPixel(aIsX, aDeltaOption, aDeltaMode, aDeltaValue, aScrollContainer) {
    if (typeof aDeltaOption === 'number') {
        return aDeltaOption;
    }

    switch (aDeltaMode) {
        case DOM_DELTA_LINE:
            return aDeltaValue * browsersLineHeight;
        case DOM_DELTA_PAGE:
            return aDeltaValue * (aIsX ? aScrollContainer.clientWidth : aScrollContainer.clientHeight);
        case DOM_DELTA_PIXEL:
        default:
            return aDeltaValue;
    }
}
