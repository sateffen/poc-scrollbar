
import { applyOptionsToScrollBarElement } from './helper';

/**
 * The scrollView is the visual representation of the current scroll state. While the scroll
 * container knows about the scroll state itself, it doesn't indicate it to the user. The
 * scrollView visualizes the current scroll state for the user, in this case by showing scrollbars.
 */
export class ScrollView {
    /**
     * This constructor sets up all elements and handlers needed to visualize normal scrollbars
     *
     * @param {PocScrollbar} aParentInstance The parent ScrollContainer instance
     * @param {PocScrollbarOptions} aOptions The options of the parent instance for styling the scollbars
     */
    constructor(aParentInstance, aOptions) {
        // first save the details about the parent instance and it's container element
        this._parent = aParentInstance._container;
        this._scrollerParent = aParentInstance;
        this._options = aOptions;
        this._destroyCallbacks = [];

        // then calculate a initial scroll factor, that is used for scrolling with the scrollbars
        // itself. The problem is, that if the user grabs the vertical scrollbar, and drags it
        // 10px down the scrollTop changed not only by ten, but 10*scrollHeight/height. This is
        // because of the absolute positioning relative to the parent
        this._scrollHeightFactor = this._parent.scrollHeight / this._parent.clientHeight;
        this._scrollWidthFactor = this._parent.scrollWidth / this._parent.clientWidth;

        // setup scroll elements
        this._xElement = aOptions.disableXScrolling ? null : this._setupElement(true);
        this._yElement = aOptions.disableYScrolling ? null : this._setupElement(false);

        // and call all update functions initially
        this.parentUpdated();
    }

    /**
     * Generates an Element to use for the scrollbar
     *
     * @param {boolean} aIsX Whether the element is X or not
     * @return {Element}
     */
    _setupElement(aIsX) {
        const element = document.createElement('div');
        const details = aIsX ? {
            name: 'xElement',
            event: 'clientX',
            factor: '_scrollWidthFactor',
            callback: 'scrollLeft'
        } : {
            name: 'yElement',
            event: 'clientY',
            factor: '_scrollHeightFactor',
            callback: 'scrollTop'
        };

        // set some default styles
        element.style.width = '0px';
        element.style.height = '0px';
        element.style.top = '0px';
        element.style.left = '0px';
        element.style.position = 'absolute';

        applyOptionsToScrollBarElement(element, details.name, this._options);

        if (!this._options.disableInteractionWithScrollbars) {
            const eventListeners = this._generateEventHandlerForElement
                .call(this, details.event, details.factor, details.callback);
            const keys = Object.keys(eventListeners);

            keys.forEach(aKey => element.addEventListener(aKey, eventListeners[aKey]));
            this._destroyCallbacks.push(() => {
                keys.forEach(aKey => element.removeEventListener(aKey, eventListeners[aKey]));
            });
        }

        this._parent.appendChild(element);
        this._destroyCallbacks.push(() => {
            this._parent.removeChild(element);
        });

        return element;
    }

    /**
     * This function generates event handlers for a scrollbar element, based on given data.
     * Warning: You need to set the this context of this function to the scrollView instance you're working with!
     *
     * @param {string} aAttribute The attribute to use from the event for calculation
     * @param {string} aPropertyFactor The factor for scroll top and left to compensate for normal distances
     * @param {string} aParentWriteCallback The name for the callback where to write to
     * @return {Object} An object containing event handlers for the scrollbar
     */
    _generateEventHandlerForElement(aAttribute, aPropertyFactor, aParentWriteCallback) {
        return {
            mousedown: (aEvent) => {
                // first of all we need to prevent the default behaviour, because otherwise the mouse
                // event might get handled as drag along
                aEvent.preventDefault();
                // then setup some cache variables, that contain the last page value and the current
                // scroll value we want to modify
                let tmpMover = aEvent[aAttribute];
                let scrollPositionFloat = this._scrollerParent[aParentWriteCallback]();

                // then setup a pointer to the move function for registering and unregistering
                let tmpMovePointer = (e) => {
                    // here we calculate the new scrollPosition
                    scrollPositionFloat += (e[aAttribute] - tmpMover) * this[aPropertyFactor];
                    // save to the cache
                    tmpMover = e[aAttribute];
                    // and set the new scroll positioning. The callback will tell us, what it did with the value
                    scrollPositionFloat = this._scrollerParent[aParentWriteCallback](Math.round(scrollPositionFloat));
                };

                // then we setup a function for the end function, which cleans up everything
                let tmpEndPointer = () => {
                    // for cleanup simply remove all event listeners
                    document.body.removeEventListener('mousemove', tmpMovePointer);
                    document.body.removeEventListener('mouseup', tmpEndPointer);
                    document.body.removeEventListener('mouseleave', tmpEndPointer);

                    // and null the pointers, just to make sure the GC can clean up everything
                    tmpMovePointer = null;
                    tmpEndPointer = null;
                };

                // and add the created event listeners, so we can actually track the movement
                document.body.addEventListener('mousemove', tmpMovePointer);
                document.body.addEventListener('mouseup', tmpEndPointer);
                document.body.addEventListener('mouseleave', tmpEndPointer);
            },
            touchstart: (aEvent) => {
                // first of all prevent the default, so the browser does nothing strange
                aEvent.preventDefault();
                // then we save the touch we want to track, so we provide multitouch support
                const touchToTrack = aEvent.which || 0;
                // and init the cache variables
                let tmpMover = aEvent.touches[touchToTrack][aAttribute];
                let scrollPositionFloat = this._scrollerParent[aParentWriteCallback]();

                // setup a move function, that we can register and unregister
                let tmpMovePointer = (aaEvent) => {
                    // if it's not the correct touch to track, just do nothing
                    if (aaEvent.which !== touchToTrack) {
                        return;
                    }
                    // first calculate the scroll new scroll position
                    scrollPositionFloat += (aaEvent.touches[touchToTrack][aAttribute] - tmpMover);
                    scrollPositionFloat *= this[aPropertyFactor];
                    // then update the cache
                    tmpMover = aaEvent.touches[touchToTrack][aAttribute];

                    // and write the new scroll value
                    scrollPositionFloat = this._scrollerParent[aParentWriteCallback](Math.round(scrollPositionFloat));
                };

                // and setup a clean up function, if the touch ends
                let tmpEndPointer = (aaEvent) => {
                    // if the touch is the wrong one, we don't want to clean up, so do nothing
                    if (aaEvent.which !== touchToTrack) {
                        return;
                    }

                    // cleanup the event listeners
                    document.body.removeEventListener('touchmove', tmpMovePointer);
                    document.body.removeEventListener('touchend', tmpEndPointer);
                    document.body.removeEventListener('touchleave', tmpEndPointer);

                    // and null some pointers for the GC
                    tmpMovePointer = null;
                    tmpEndPointer = null;
                };

                // finally add the event listners for the gesture
                document.body.addEventListener('touchmove', tmpMovePointer);
                document.body.addEventListener('touchend', tmpEndPointer);
                document.body.addEventListener('touchleave', tmpEndPointer);
            }
        };
    }

    /**
     * This method handles updating the scrollTop property to the scrollbars. Every time
     * the parent scrollTop changes, this recalculates the style
     *
     * @param {number} aScrollTop
     */
    scrollTopUpdated(aScrollTop) {
        if (this._yElement && this._parentScrollHeight > this._parentHeight) {
            let partSize = aScrollTop / (this._parentScrollHeight - this._parentHeight);
            partSize *= (this._parentHeight - this._elementHeight);
            this._yElement.style.top = `${aScrollTop + partSize}px`;
        }

        if (this._xElement) {
            this._xElement.style.top = `${Math.floor(aScrollTop + this._parentHeight)}px`;
        }
    }

    /**
     * This method handles updating the scrollLeft property to the scrollbars. Every time
     * the parent scrollLeft changes, this recalculates the style
     *
     * @param {number} aScrollLeft
     */
    scrollLeftUpdated(aScrollLeft) {
        if (this._xElement && this._parentScrollWidth > this._parentWidth) {
            let partSize = aScrollLeft / (this._parentScrollWidth - this._parentWidth);
            partSize *= (this._parentWidth - this._elementWidth);
            this._xElement.style.left = `${aScrollLeft + partSize}px`;
        }

        if (this._yElement) {
            this._yElement.style.left = `${Math.floor(aScrollLeft + this._parentWidth)}px`;
        }
    }

    /**
     * This method handles the case, that the parent has updates. All data gets updated
     * and recalculated here.
     */
    parentUpdated() {
        // read and recalculate all needed data
        this._parentWidth = this._parent.clientWidth;
        this._parentScrollWidth = this._parent.scrollWidth;
        this._elementWidth = (this._parentWidth * this._parentWidth) / this._parentScrollWidth;
        this._parentHeight = this._parent.clientHeight;
        this._parentScrollHeight = this._parent.scrollHeight;
        this._elementHeight = (this._parentHeight * this._parentHeight) / this._parentScrollHeight;
        this._scrollHeightFactor = this._parent.scrollHeight / this._parent.clientHeight;
        this._scrollWidthFactor = this._parent.scrollWidth / this._parent.clientWidth;

        // determine visibility of x element
        if (this._xElement) {
            if (this._parentWidth < this._parentScrollWidth) {
                // check if the xMinSize option is available and if the element is too small
                if (typeof this._options.xMinSize === 'number' && this._elementWidth < this._options.xMinSize) {
                    this._elementWidth = this._options.xMinSize;
                }

                this.scrollTopUpdated(this._parent.scrollTop);
                this._xElement.style.display = 'block';
                this._xElement.style.width = `${this._elementWidth}px`;
            }
            else {
                this._xElement.style.display = 'none';
            }
        }

        // determine visibility of y element
        if (this._yElement) {
            if (this._parentHeight < this._parentScrollHeight) {
                // check if the yMinSize option is available and if the element is too small
                if (typeof this._options.yMinSize === 'number' && this._elementHeight < this._options.yMinSize) {
                    this._elementHeight = this._options.yMinSize;
                }

                this.scrollLeftUpdated(this._parent.scrollLeft);
                this._yElement.style.display = 'block';
                this._yElement.style.height = `${this._elementHeight}px`;
            }
            else {
                this._yElement.style.display = 'none';
            }
        }
    }

    /**
     * This method is like the destructor of casual classes. When this is called,
     * the instance of this class is practically useless. This frees all resources
     * for the GC.
     */
    destroy() {
        // first call all destroy callbacks
        this._destroyCallbacks.forEach(aCallback => aCallback());

        // and then null all data, so the GC can clean it up
        this._parent = null;
        this._scrollerParent = null;
        this._xElement = null;
        this._yElement = null;
    }
}
