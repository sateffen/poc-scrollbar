
/**
 * Creates a baseevent for the event listeners
 * @return {Object} The actual baseevent
 */
function createBaseEvent() {
    const timestamp = Date.now();
    let propagationStopped = false;
    let defaultPrevented = false;

    return {
        get timestamp() {
            return timestamp;
        },

        get defaultPrevented() {
            return defaultPrevented;
        },
        preventDefault() {
            defaultPrevented = true;
        },

        get propagationStopped() {
            return propagationStopped;
        },
        stopPropagation() {
            propagationStopped = true;
        },
    };
}

/**
 * A generic function to bind for scrollTop and scrollLeft change events
 * @param {string} aEventType The event type
 * @param {HTMLElement} aTarget
 * @param {HTMLElement} aSrcElement
 * @param {number} aOldScrollValue
 * @param {number} aNewScrollValue
 * @return {Object} The actual event object
 */
function createScrollChangedEvent(aEventType, aTarget, aSrcElement, aOldScrollValue, aNewScrollValue) {
    const baseEvent = createBaseEvent();

    Object.defineProperties(baseEvent, {
        type: {
            get: () => aEventType,
            configurable: false,
            enumerable: true,
        },
        target: {
            get: () => aTarget,
            configurable: false,
            enumerable: true,
        },
        srcElement: {
            get: () => aSrcElement,
            configurable: false,
            enumerable: true,
        },
        delta: {
            get: () => aNewScrollValue - aOldScrollValue,
            configurable: false,
            enumerable: true,
        },
        oldValue: {
            get: () => aOldScrollValue,
            configurable: false,
            enumerable: true,
        },
        newValue: {
            get: () => aNewScrollValue,
            configurable: false,
            enumerable: true,
        },
    });

    return baseEvent;
}

/**
 * Creates an scrollTopChanged event
 * @param {HTMLElement} aTarget
 * @param {HTMLElement} aSrcElement
 * @param {number} aOldScrollValue
 * @param {number} aNewScrollValue
 * @return {Object} The actual event object
 */
export const createScrollTopChangedEvent = createScrollChangedEvent.bind(null, 'scrollTopChanged');

/**
 * Creates an scrollLeftChanged event
 * @param {HTMLElement} aTarget
 * @param {HTMLElement} aSrcElement
 * @param {number} aOldScrollValue
 * @param {number} aNewScrollValue
 * @return {Object} The actual event object
 */
export const createScrollLeftChangedEvent = createScrollChangedEvent.bind(null, 'scrollLeftChanged');
