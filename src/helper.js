
/**
 * This applies the given options to the scrollbar elements
 *
 * @param {HTMLElement} aElement The scrollbar element to apply the options to
 * @param {string} aElementName The element name (xElement and yElement) to create the options read propertys from
 * @param {object} aOptions The options to read from
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
 * @param {function} aCallback The callback to call debounced
 * @param {number} aWaitTime The time to wait till calling the callback
 * @return {function} The replacement function
 */
export function debounce(aCallback, aWaitTime) {
    let pointer = null;

    return () => {
        window.clearTimeout(pointer);
        pointer = window.setTimeout(aCallback, aWaitTime);
    };
}
