# poc-scroller ![codeship status](https://codeship.com/projects/caec9210-ade5-0134-3cb2-36e7a5ec89be/status?branch=master)

This is a rework of the scroller project, which I want to publish to NPM.
The problem with the scroller is, that the name is taken, and I want to make some changes under the hood
(development process and so on).

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
* checkInterval
    * Type: Number
    * Description: This option will tell, in what interval the container should be checked. The interval will check
    the size of the container itself, and whether the container is in the DOM tree or not. If the container is not
    in the DOM tree anymore, the destroy method is invoked automatically. The unit is ms.
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