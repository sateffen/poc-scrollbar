# poc-scrollbar

This scrollbar started out as proof-of-concept (hence poc -> poc-scrollbar), but got adopted in several projects. So now it's
a full blown library, doing everything a real scrollbar needs to do. Additionally, it doesn't care about other libraries you
use, it has no dependencies, you can just use it, and it'll do what you expect.

For details, maybe troubleshooting or so please scroll down to the "[Good to know](https://github.com/sateffen/poc-scrollbar#good-to-know)"
section.

## Installing it

The poc-scrollbar is available via [npm](https://www.npmjs.com/package/poc-scrollbar). Just use one of the following commands:

```sh
npm install poc-scrollbar --save
yarn add poc-scrollbar
```
If you can't use it via npm, refer to the bottom of this document. There is a chapter called *Build the project*.

## Basic API

This library just exports a constructor, which you can use like:

```js
const PocScrollbar = require('poc-scrollbar'); // or: import PocScrollbar from 'poc-scrollbar'
const myElement = document.getElementById(...);
const myOptions = {...};
const instance = new PocScrollbar(myElement, myOptions);
```

The library will track the element by itself, apply the scrollbars if necessary, and destroy itself if the
element gets detached from the DOM tree. You can use the instance methods as well, just as you like.

For a list of all options please see the list below.

### Instance methods

* scrollTop(newValue)
    * Description: Setter and getter for the current scrollTop value
    * Param `newValue`: Number (Optional)
    * Returns: Number
* scrollLeft(newValue)
    * Description: Setter and getter for the current scrollLeft value
    * Param `newValue`: Number (Optional)
    * Returns: Number
* addEventListener(eventName, callback)
    * Description: Adds given callback as eventlistener for given eventname. For possible event objects see below
    * Param `eventName`: String - The event name. Possible options are: *scrollTopChanged*, *scrollLeftChanged*
    * Param `callback`: Function - The callback to register as eventlistener
* removeEventListener(eventName, callback)
    * Description: Removes given callback as eventlistener from given eventname
    * Param `eventName`: String - The event name. Possible options are: *scrollTopChanged*, *scrollLeftChanged*
    * Param `callback`: Function - The callback to remove as eventlistener
* destroy()
    * Description: Destroys the current instance of the scrollbar (removes elements, unregisters listeners and so on)

### Available options

There are some options, you can use. Pass them along as object to the PocScrollbar constructor:

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
    mutation has occurred
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
* wheelDeltaSize
    * Type: Number
    * Description: A constant size in pixel to scroll on each wheel event, ignoring the event values
    * Default: undefined (use event values)

### Event objects

All properties of all event objects are readonly. Values can only get changed by
their corresponding functions.

#### scrollTopChanged and scrollLeftChanged events

* timestamp
    * Type: Number
    * Description: The time, when the event occured, in ms.
* defaultPrevented
    * Type: Boolean
    * Description: Whether the default behaviour is prevented. If it is, the change in scrollTop/scrollLeft won't happen. Can only get changed by *preventDefault*.
* preventDefault
    * Type: Function
    * Description: Sets *defaultPrevented* to true.
* propagationStopped
    * Type: Boolean
    * Description: Whether the event should get propagated to the next event-listeners or not. Can only get changed by *stopPropagation*.
* stopPropagation
    * Type: Function
    * Description: Sets *propagationStopped* to true.
* type
    * Type: String
    * Description: The actual event-type. Possible values are *scrollTopChanged* and *scrollLeftChanged*.
* target
    * Type: HTMLElement
    * Description: The actual scrollbar element, that will be affected, so either the horizontal or vertical scrollbar.
* srcElement
    * Type: HTMLElement
    * Description: The scroll-container, that was passed to the PocScrollbar-constructor.
* delta
    * Type: Number
    * Description: The actual delta between old and new value of scrollTop/scrollLeft (in pixel)
* oldValue
    * Type: Number
    * Description: The old value of scrollTop/scrollLeft, before the event gets applied (in pixel)
* newValue
    * Type: Number
    * Description: The new value of scrollTop/scrollLeft, after the event gets applied (in pixel)

## Build the project

To build the project you have to install the dependencies and run the build script. You can do so
using [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/):

```sh
npm install
npm run build
```

or

```sh
yarn install
yarn run build
```

The result is *dist/pocscroller.js*. It's not uglified, human readable code, so you can use it for
debugging as well.

## Good to know

#### What do I need to use this?

The code itself is written in ES6, so if you're using the raw code with a module bundler, you have to
transpile it first. If you don't want to add a transpiler, simply build this project (see
[build the project](https://github.com/sateffen/poc-scrollbar#build-the-code)) and use the resulting file.

#### Is shift + wheel scrolling supported?

Yes, scrolling with your mouse wheel while pressing shift will attempt to scroll horizontally, not vertically.

#### Why do I have to call *destroy* by myself with MutationObservers?

The problem is quite simple: A MutationObserver doesn't detect deleting the observed container, so
there is no way to know, when to call the *destroy* method. I could observe the parent, and check
the deletion of the container that way, but what happens, when the parent gets deleted?

Because this is not doable without to much overhead, I don't know how to make this happen. If you've
got an idea, leave me an [issue](https://github.com/sateffen/poc-scrollbar/issues).

#### Why does the MutationObserver trigger the mutation handler twice?

The mutation handler might manipulate the scrollbars itself, which are children of the observed
container as well, so it'll trigger itself again. In the second iteration there aren't any changes,
so the mutation handler won't run a third time.
