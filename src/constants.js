/**
 * This constant is one possible option for the deltaMode property of a wheel event.
 * This deltaMode measures the delta values in pixels.
 *
 * @type {number}
 */
export const DOM_DELTA_PIXEL = (window.WheelEvent && window.WheelEvent.DOM_DELTA_PIXEL) || 0x00;

/**
 * This constant is one possible option for the deltaMode property of a wheel event.
 * This deltaMode measures the delta values in lines.
 *
 * @type {number}
 */
export const DOM_DELTA_LINE = (window.WheelEvent && window.WheelEvent.DOM_DELTA_LINE) || 0x01;

/**
 * This constant is one possible option for the deltaMode property of a wheel event.
 * This deltaMode measures the delta values in pages.
 *
 * @type {number}
 */
export const DOM_DELTA_PAGE = (window.WheelEvent && window.WheelEvent.DOM_DELTA_PAGE) || 0x02;

/**
 * This constant tells the browsers line height for one line. This is used for calculating the distance
 * to scroll in a wheel event.
 *
 * @type {number}
 */
export const BROWSER_LINE_HEIGHT = window.parseInt(
    window
        .getComputedStyle(document.querySelector('html'), null)
        .getPropertyValue('font-size'), 10) || 16;

/**
 * Contains all allowed touch-action values for x direction
 * @type {Array<string>}
 */
export const ALLOWED_X_TOUCH_ACTIONS = ['auto', 'manipulation', 'pan-x'];

/**
 * Contains all allowed touch-action values for y direction
 * @type {Array<string>}
 */
export const ALLOWED_Y_TOUCH_ACTIONS = ['auto', 'manipulation', 'pan-y'];

/**
 * A boolean telling about the passive event listening support
 * @type {boolean}
 */
export const SUPPORTS_PASSIVE = (() => {
    let supportsPassive = false;

    try {
        const opts = Object.defineProperty({}, 'passive', {
            get() {
                supportsPassive = true;

                return true;
            },
        });
        window.addEventListener('test', null, opts);
    }
    catch (e) {
        // supportsPassive is false
    }

    return supportsPassive;
})();
