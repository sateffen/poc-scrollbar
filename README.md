# poc-scroller ![codeship status](https://codeship.com/projects/caec9210-ade5-0134-3cb2-36e7a5ec89be/status?branch=master)

This is a proof-of-concept scrollbar (poc-scrollbar), that just works.

## Requirements

This scrollbar uses the MutationObserver, so your browser has to support the MutationObserver. You can tell
the library to use an interval checker instead, by using the option *useInterval* (see further down), but it's
recommended to use the MutationObserver.

## Basic API

This library just exports a constructor, which you can use like:

    const PocScrollbar = require('poc-scrollbar');
    const myElement = document.getElementById(...);
    const myOptions = {...};
    const instance = new PocScrollbar(myElement, myOptions);

The library will track the element by itself, apply the scrollbars if necessary, and destroy itself if the
element gets detached from the DOM tree. You can use the instance methods as well, just as you like.

For a list of all options please see the list below.

## Instance methods

* scrollTop(newValue)
    * Description: Setter and getter for the current scrollTop value
    * Returns: Number
* scrollLeft(newValue)
    * Description: Setter and getter for the current scrollLeft value
    * Returns: Number
* destroy()
    * Description: Destroys the current instance of the scrollbar (removes elements, unregisters listeners and so on)

## Available options

There are some options, you can use:

* disableTouchScrollingOnContainer
    * Type: Boolean
    * Description: This option tells the container, not to add event listeners for touch
    scrolling to the container, otherwise touch users can put their finger anywhere in the container and scroll with
    this like they are used to.
    * Default: false
* disableInteractionWithScrollbars
    * Type: Boolean
    * Description: This option tells the scrollbars not to interact with mouse and touch. This way you can disable
    scrolling with holding the scrollbars, so it's just an indicator, nothing interactive.
    * Default: false
* useInterval
    * Type: Boolean
    * Description: Tells the observer to use an interval to check the container for changes regulary. This option
    disables the MutationObserver, and should help you if you experience a huge load with the MutationObserver.
    * Default: false
* checkInterval
    * Type: Number
    * Description: This option depends on *useInterval*. If *useInterval* is false (default), this tells the debounce
    time for the mutation observer to wait, after the last DOM update has happend. If *useInterval* is true, this tells
    the time for the interval to check for updates to the DOM.
    * Default: 300
* disableXScrolling
    * Type: Boolean
    * Description: Whether to disable scrolling in x directory.
    * Default: false
* disableYScrolling
    * Type: Boolean
    * Description: Whether to disable scrolling in y directory.
    * Default: false
* xElementStyles
    * Type: Object
    * Description: An object which contains styles, that should get applied to the x scroll element. This
    overwrites the default style.
    * Default: {}
* yElementStyles
    * Type: Object
    * Description: An object which contains styles, that should get applied to the y scroll element. This
    overwrites the default style.
    * Default: {}
* xElementClass
    * Type: Array[string] | string
    * Description: A class or classlist, that gets applied to the x scroll element.
    * Default: []
* yElementClass
    * Type: Array[string] | string
    * Description: A class or classlist, that gets applied to the y scroll element.
    * Default: []
* xMinSize
    * Type: Number
    * Description: The minimal size of the x scrollbar in px.
    * Default: undefined (no minsize)
* yMinSize
    * Type: Number
    * Description: The minimal size of the y scrollbar in px.
    * Default: undefined (no minsize)

## Build the code

To actually build the project, just install the dependencies and execute `npm run build`.

You can install the dependencies with npm or yarn.