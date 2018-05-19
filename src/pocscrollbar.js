
import {ScrollView} from './scrollview';
import {debounce, getWheelDeltaAsPixel} from './helper';

/**
 * Contains all allowed touch-action values for x direction
 * @type {Array<string>}
 */
const ALLOWED_X_TOUCH_ACTIONS = ['auto', 'manipulation', 'pan-x'];

/**
 * Contains all allowed touch-action values for y direction
 * @type {Array<string>}
 */
const ALLOWED_Y_TOUCH_ACTIONS = ['auto', 'manipulation', 'pan-y'];

/**
 * A boolean telling about the passive event listening support
 * @type {boolean}
 */
const SUPPORTS_PASSIVE = (() => {
    let supportsPassive = false;

    try {
        const opts = Object.defineProperty({}, 'passive', {
            get() {
                supportsPassive = true;
            },
        });
        window.addEventListener('test', null, opts);
    }
    catch (e) {
        // supportsPassive is false
    }

    return supportsPassive;
})();

/**
 * @typedef {Object} PocScrollbarOptions
 * @property {boolean} [aOptions.disableInteractionWithScrollbars=false]
 * @property {boolean} [aOptions.disableTouchScrollingOnContainer=false]
 * @property {boolean} [aOptions.useMutationObserver=false]
 * @property {number} [aOptions.checkInterval=300]
 * @property {boolean} [aOptions.disableXScrolling=false]
 * @property {boolean} [aOptions.disableYScrolling=false]
 * @property {Object} [aOptions.xElementStyles={}]
 * @property {Object} [aOptions.xElementStyles={}]
 * @property {Array.<String>|String} [aOptions.xElementClass=[]]
 * @property {Array.<String>|String} [aOptions.yElementClass=[]]
 * @property {number} [aOptions.xMinSize]
 * @property {number} [aOptions.yMinSize]
 * @property {number} [aOptions.wheelDeltaSize]
 */
/**
 * The scroll container represents the main element, which contains too long
 * content. It'll detect everything by itself and acts based on your configuration.
 * The visualization is not done here, it's done in the ScrollView
 */
export default class PocScrollbar {
    /**
     * Here is the main starting point. The constructor will set up all events and the
     * scrollView.
     * Warning: The container elements needs to serve as container for absolute elements.
     * To guarantee this, the style is changed to position=relative if it's not already
     * relative or absolute.
     *
     * @param {Element} aElement The element that should be scrollable
     * @param {PocScrollbarOptions} [aOptions = {}] The provided options. For details see README.md
     */
    constructor(aElement, aOptions = {}) {
        // first we initialize all member properties
        this._container = aElement;
        this._options = aOptions;
        this._scrollTop = 0;
        this._scrollLeft = 0;
        this._scrollView = new PocScrollbar.ScrollView(this, this._options);
        this._destroyCallbacks = [
            () => this._scrollView.destroy(),
        ];

        // then go and set the style for the container element. It's important to disable overflow
        // and set the container to some style, that acts as container for absolute elements
        this._container.style.overflow = 'hidden';
        const currentPositionStyle = window.getComputedStyle(this._container, null).getPropertyValue('position');
        if (currentPositionStyle !== 'absolute' && currentPositionStyle !== 'relative') {
            this._container.style.position = 'relative';
        }

        this._setupMutationHandler();
        this._setupEventListeners();

        // and tell the scrollView to execute a parentUpdated
        this._scrollView.parentUpdated();
    }

    /**
     * Sets the mutation handlers for this instance up
     *
     * @private
     */
    _setupMutationHandler() {
        // first we generate the data for the observers, and validate the options
        const checkInterval = typeof this._options.checkInterval === 'number' ? this._options.checkInterval : 300;
        const mutationHandler = this._getMutationHandler();
        // then we validate the useMutationObserver option
        this._options.useMutationObserver = MutationObserver ? this._options.useMutationObserver : false;

        // and then we setup the corresponding mutation handler and its destroy callback
        if (this._options.useMutationObserver) {
            const [debouncedMutationHandler, destroyCallback] = debounce(mutationHandler, checkInterval);
            const mutationObserver = new MutationObserver(debouncedMutationHandler);

            window.addEventListener('resize', debouncedMutationHandler);
            mutationObserver.observe(this._container, {
                attributes: true, childList: true, characterData: true, subtree: true,
            });

            this._destroyCallbacks.push(() => {
                destroyCallback();
                mutationObserver.disconnect();
                window.removeEventListener('resize', debouncedMutationHandler);
            });
        }
        else {
            const intervalPointer = window.setInterval(mutationHandler, checkInterval);

            this._destroyCallbacks.push(() => window.clearInterval(intervalPointer));
        }
    }

    /**
     * Sets all eventlisteners for this instance up
     *
     * @private
     */
    _setupEventListeners() {
        // first we setup the event listeners, that we want to register to the container
        const wheelHandler = this._wheelHandler.bind(this);
        const touchHandler = this._touchHandler.bind(this);

        // then we attach all event handlers to the container
        this._container.addEventListener('wheel', wheelHandler);
        if (!this._options.disableTouchScrollingOnContainer) {
            this._container.addEventListener('touchstart', touchHandler);
        }

        // and we generate a destroy callback for cleanup
        this._destroyCallbacks.push(() => {
            this._container.removeEventListener('wheel', wheelHandler);
            if (!this._options.disableTouchScrollingOnContainer) {
                this._container.removeEventListener('touchstart', touchHandler);
            }
        });
    }

    /**
     * Handles wheel events on this instance
     *
     * @private
     * @param {WheelEvent} aEvent
     */
    _wheelHandler(aEvent) {
        // if the default is prevented, we ignore this event
        if (aEvent.defaultPrevented) {
            return;
        }

        // else we store the old values
        const currentScrollTop = this._container.scrollTop;
        const currentScrollLeft = this._container.scrollLeft;
        const deltaX = getWheelDeltaAsPixel(
            true,
            this._options.wheelDeltaSize,
            aEvent.deltaMode,
            aEvent.deltaX,
            this._container
        );
        const deltaY = getWheelDeltaAsPixel(
            false,
            this._options.wheelDeltaSize,
            aEvent.deltaMode,
            aEvent.deltaY,
            this._container
        );

        // trigger the changing
        this.scrollTop(this._container.scrollTop + deltaY);
        this.scrollLeft(this._container.scrollLeft + deltaX);

        // and if something actually changed
        if (currentScrollTop !== this._container.scrollTop ||
            currentScrollLeft !== this._container.scrollLeft
        ) {
            // we call prevent default, so the browser and other scrollbars won't
            // do anything
            aEvent.preventDefault();
        }
    }

    /**
     * Handles all touch events on this instance
     *
     * @private
     * @param {TouchEvent} aEvent
     */
    _touchHandler(aEvent) {
        if (aEvent.defaultPrevented) {
            return;
        }

        // save a pointer to the touch to track. This should help to support multitouch
        const touchToTrack = aEvent.which || 0;
        // and save temporary variables for the move calculation
        let tmpMoverX = aEvent.touches[touchToTrack].clientX;
        let tmpMoverY = aEvent.touches[touchToTrack].clientY;

        // read the touch-action from the target element for checking
        const touchActionValue = window.getComputedStyle(aEvent.target, null).getPropertyValue('touch-action');
        const xPanAllowed = ALLOWED_X_TOUCH_ACTIONS.indexOf(touchActionValue) > -1;
        const yPanAllowed = ALLOWED_Y_TOUCH_ACTIONS.indexOf(touchActionValue) > -1;

        // then setup a move function pointer
        let tmpMovePointer = (aaEvent) => {
            // prevented events should not be handled
            if (aaEvent.defaultPrevented) {
                return;
            }

            // which only tracks the correct touch
            if (aaEvent.which !== touchToTrack) {
                return;
            }

            // check, if the touch is allowed to scroll in x direction
            if (xPanAllowed) {
                const distanceX = tmpMoverX - aaEvent.touches[touchToTrack].clientX;
                this.scrollLeft(this._container.scrollLeft + distanceX);
                aaEvent.preventDefault();
            }

            // check, if the touch is allowed to scroll in y direction
            if (yPanAllowed) {
                const distanceY = tmpMoverY - aaEvent.touches[touchToTrack].clientY;
                this.scrollTop(this._container.scrollTop + distanceY);
                aaEvent.preventDefault();
            }

            // and update the tmp movers
            tmpMoverX = aaEvent.touches[touchToTrack].clientX;
            tmpMoverY = aaEvent.touches[touchToTrack].clientY;
        };

        // finally setup a pointer to a touchend function handler
        let tmpEndPointer = (aaEvent) => {
            // which only reacts to the correct touch
            if (aaEvent && aaEvent.which !== touchToTrack) {
                return;
            }
            // else it's the correct touch, or no touch at all. If it's no touch at all, it's a destroy call
            // deregisters the event handlers
            document.body.removeEventListener('touchmove', tmpMovePointer);
            document.body.removeEventListener('touchend', tmpEndPointer);
            document.body.removeEventListener('touchleave', tmpEndPointer);

            const destroyIndexToRemove = this._destroyCallbacks.indexOf(tmpEndPointer);

            if (destroyIndexToRemove > -1) {
                this._destroyCallbacks.splice(destroyIndexToRemove, 1);
            }

            // and nulls the pointer for freeing memory
            tmpMovePointer = null;
            tmpEndPointer = null;
        };

        // and finally add the event handlers, so this will actually work correctly
        document.body.addEventListener('touchmove', tmpMovePointer, SUPPORTS_PASSIVE ? {passive: false} : false);
        document.body.addEventListener('touchend', tmpEndPointer);
        document.body.addEventListener('touchleave', tmpEndPointer);
        this._destroyCallbacks.push(tmpEndPointer);
    }

    /**
     * This function creates a closure, that handles update checks.
     *
     * @private
     * @return {Function} An interval handler to call at each tick
     */
    _getMutationHandler() {
        // setup some variables, that serve as cache for the closure
        let containerHeight = this._container.clientHeight;
        let containerWidth = this._container.clientWidth;
        let scrollHeight = this._container.scrollHeight;
        let scrollWidth = this._container.scrollWidth;

        // then return the closure function
        return () => {
            // if the container doesn't exist anymore, we can't do anything
            if (this._container === null) {
                return;
            }

            // search for the root element of this element
            let potentialRootElement = this._container.parentElement;
            while (potentialRootElement !== null &&
                potentialRootElement !== undefined &&
                potentialRootElement !== document.body
            ) {
                potentialRootElement = potentialRootElement.parentElement;
            }

            // then we reset the scrollbars to 0, because we want the INNER elements
            // to determine the position, not the outer ones
            const oldScrollTop = this._scrollTop;
            const oldScrollLeft = this._scrollLeft;

            this._scrollView.scrollTopUpdated(0);
            this._scrollView.scrollLeftUpdated(0);

            // if there is no root element
            if (potentialRootElement === null || potentialRootElement === undefined) {
                // simply destroy everything, because we are detached from DOM
                this.destroy();
                return;
            }
            // else check if something has changed
            else if (
                containerHeight !== this._container.clientHeight ||
                containerWidth !== this._container.clientWidth ||
                scrollHeight !== this._container.scrollHeight ||
                scrollWidth !== this._container.scrollWidth
            ) {
                // and if something has changed, refresh the cache
                containerHeight = this._container.clientHeight;
                containerWidth = this._container.clientWidth;
                scrollHeight = this._container.scrollHeight;
                scrollWidth = this._container.scrollWidth;

                // and tell the scrollView about the parent update
                this._scrollView.parentUpdated();
            }

            if (this._scrollTop !== this._container.scrollTop) {
                this.scrollTop(this._container.scrollTop);
            }
            else if (oldScrollTop < scrollHeight) {
                this._scrollView.scrollTopUpdated(oldScrollTop);
            }

            if (this._scrollLeft !== this._container.scrollLeft) {
                this.scrollLeft(this._container.scrollLeft);
            }
            else if (oldScrollLeft < scrollWidth) {
                this._scrollView.scrollLeftUpdated(oldScrollLeft);
            }
        };
    }

    /**
     * This function serves as getter and setter for the scrollTop value
     *
     * @param {number} [aScrollTop] The new scrollTop value
     * @return {number} The new scrollTop value
     */
    scrollTop(aScrollTop) {
        // If this method was called with something else than a number, or scrolling is
        // completely disabled, just return the scroll top and do nothing else
        if (typeof aScrollTop !== 'number' || this._options.disableYScrolling) {
            return this._container.scrollTop;
        }

        let newScrollTop = aScrollTop;
        // then validate the newScrollTop value
        if (newScrollTop < 0) {
            newScrollTop = 0;
        }
        else if (newScrollTop > this._container.scrollHeight - this._container.clientHeight) {
            newScrollTop = this._container.scrollHeight - this._container.clientHeight;
        }

        // if the scroll top has changed
        if (this._scrollTop !== newScrollTop) {
            // call the update trigger and save the scroll top value
            this._scrollView.scrollTopUpdated(newScrollTop);
            this._container.scrollTop = newScrollTop;
            this._scrollTop = newScrollTop;
        }

        // finally simply return the scrollTop value
        return newScrollTop;
    }

    /**
     * This function serves as getter and setter for the scrollLeft value
     *
     * @param {number} [aScrollLeft] The new scrollLeft value
     * @return {number} The new scrollLeft value
     */
    scrollLeft(aScrollLeft) {
        // If this method was called with something else than a number, or scrolling is
        // completely disabled, just return the scroll top and do nothing else
        if (arguments.length === 0 || this._options.disableXScrolling) {
            return this._container.scrollLeft;
        }

        let newScrollLeft = aScrollLeft;
        // now validate the scrollLeft value
        if (newScrollLeft < 0) {
            newScrollLeft = 0;
        }
        else if (newScrollLeft > this._container.scrollWidth - this._container.clientWidth) {
            newScrollLeft = this._container.scrollWidth - this._container.clientWidth;
        }

        // if scrollLeft has changed
        if (this._scrollLeft !== newScrollLeft) {
            // call the update trigger and save set the scrollLeft value
            this._scrollView.scrollLeftUpdated(newScrollLeft);
            this._container.scrollLeft = newScrollLeft;
            this._scrollLeft = newScrollLeft;
        }

        // finally return the scrollLeft value
        return newScrollLeft;
    }

    /**
     * This method is like the destructor. If you destroy this object, all footprints like
     * event listeners and so on get removed and destroyed.
     */
    destroy() {
        // execute all destroy callbacks
        this._destroyCallbacks.forEach((aCallback) => aCallback());

        // and null the pointers to the GC can clean up, even if this object isn't cleaned up
        this._scrollView = null;
        this._container = null;
        this._destroyCallbacks = [];
    }
}

// and add the scrollview as static property, so it's overwritable
/**
 * A reference to the scrollview to use
 * @static
 * @type {ScrollView}
 */
PocScrollbar.ScrollView = ScrollView;
