# poc-scroller ![codeship status](https://codeship.com/projects/caec9210-ade5-0134-3cb2-36e7a5ec89be/status?branch=master)

This is a scrollbar, that started out as proof-of-concept (so poc -> poc-scrollbar), but got adopted in several projects.
It doesn't care about other libraries you use, it has no dependencies, you can just use it, and it'll do what you expect.

For details, maybe troubleshooting or so please scroll down to the "[Good to know](https://github.com/sateffen/poc-scrollbar#good-to-know)"
section.

## Basic API

This library just exports a constructor, which you can use like:

    const PocScrollbar = require('poc-scrollbar'); // you can use import PocScrollbar from 'poc-scrollbar' as well
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
* useMutationObserver
    * Type: Boolean
    * Description: Tells the scrollbar to use mutation observers instead of an interval to check for changes to the DOM.
    This saves you some CPU power.
    
    **WARNING**: You have to call *destroy* by yourself when using this, because the
    mutation observer can't observe removing the element. For details see the "[Good to know](https://github.com/sateffen/poc-scrollbar#good-to-know)"
    section below.
    * Default: false
* checkInterval
    * Type: Number
    * Description: This option depends on *useMutationObserver*. If *useMutationObserver* is false (default), this tells
    the interval time between mutation checks. If *useMutationObserver* is true, this tells the debounce time after a
    mutation has occured
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

## Build the project

To build the project you have to install the dependencies and run the build script. You can do so
using [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/):

    npm install
    npm run build

or

    yarn install
    yarn run build

The result is *dist/pocscroller.js*. It's not uglified, human readable code, so you can use it for
debugging as well.

## Good to know

### What do I need to use this?

The code itself is written in ES6, so if you're using the raw code with a module bundler, you have to
transpile it first. If you don't want to add a transpiler, simply build this project (see
[build the project](https://github.com/sateffen/poc-scrollbar#build-the-code)) and use the resulting file.

### Why do I have to call *destroy* by myself with MutationObservers?

The problem is quite simple: A MutationObserver doesn't detect deleting the observed container, so
there is no way to know, when to call the *destroy* method. I could observe the parent, and check
the deletion of the container that way, but what happens, when the parent gets deleted?

Because this is not doable without to much overhead, I don't know how to make this happen. If you've
got an idea, leave me an [issue](https://github.com/sateffen/poc-scrollbar/issues).

### Why does the MutationObserver trigger the mutation handler twice?

The mutation handler might manipulate the scrollbars itself, which are children of the observed
container as well, so it'll trigger itself again. In the second iteration there aren't any changes,
so the mutation handler won't run a third time.
