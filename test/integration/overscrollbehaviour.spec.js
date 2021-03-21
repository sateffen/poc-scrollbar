import PocScrollbar from '../../src/pocscrollbar';

describe('Overscroll behaviour', () => {
    let instance = null;
    let childInstanceAuto = null;
    let childInstanceNone = null;
    let parent = null;
    let childAuto = null;
    let childNone = null;
    let grandChildAuto = null;
    let grandChildNone = null;

    beforeEach(() => {
        instance = null;
        childInstanceAuto = null;
        childInstanceNone = null;
        parent = document.createElement('div');
        childAuto = document.createElement('div');
        childNone = document.createElement('div');
        grandChildAuto = document.createElement('div');
        grandChildNone = document.createElement('div');

        parent.style.height = '100px';
        parent.style.width = '100px';
        childAuto.style.height = '200px';
        childAuto.style.width = '200px';
        childNone.style.height = '200px';
        childNone.style.width = '200px';
        grandChildAuto.style.height = '300px';
        grandChildAuto.style.width = '300px';
        grandChildNone.style.height = '300px';
        grandChildNone.style.width = '300px';

        parent.appendChild(childAuto);
        parent.appendChild(childNone);
        childAuto.appendChild(grandChildAuto);
        childNone.appendChild(grandChildNone);
        document.body.appendChild(parent);
        instance = new PocScrollbar(parent, {
            xElementClass: ['scrollbar', 'horizontal'],
            yElementClass: ['scrollbar', 'vertical'],
        });
        childInstanceAuto = new PocScrollbar(childAuto, {
            xElementClass: ['scrollbar', 'horizontal'],
            yElementClass: ['scrollbar', 'vertical'],
        });
        childInstanceNone = new PocScrollbar(childNone, {
            xElementClass: ['scrollbar', 'horizontal'],
            yElementClass: ['scrollbar', 'vertical'],
            xOverscrollBehaviour: 'none',
            yOverscrollBehaviour: 'none',
        });
    });

    afterEach(() => {
        document.body.removeChild(parent);
        parent = null;
        childAuto = null;
        childNone = null;
        grandChildAuto = null;
        grandChildNone = null;

        if (instance) {
            instance.destroy();
            instance = null;
        }

        if (childInstanceAuto) {
            childInstanceAuto.destroy();
            childInstanceAuto = null;
        }

        if (childInstanceNone) {
            childInstanceNone.destroy();
            childInstanceNone = null;
        }
    });

    it('should do x-scroll-chaining scrolling left if xScrollBehaviour is not set', () => {
        instance.scrollLeft(50);
        const event = new WheelEvent('wheel', {
            deltaX: 0,
            deltaY: -25,
            shiftKey: true,
            bubbles: true,
            cancelable: true,
        });

        childAuto.dispatchEvent(event);

        expect(parent.scrollLeft).toBe(25);
        expect(childAuto.scrollLeft).toBe(0);
    });

    it('should not do x-scroll-chaining scrolling left if xScrollBehaviour is set to "none"', () => {
        instance.scrollLeft(50);
        const event = new WheelEvent('wheel', {
            deltaX: 0,
            deltaY: -25,
            shiftKey: true,
            bubbles: true,
            cancelable: true,
        });

        childNone.dispatchEvent(event);

        expect(parent.scrollLeft).toBe(50);
        expect(childNone.scrollLeft).toBe(0);
    });

    it('should do x-scroll-chaining scrolling right if xScrollBehaviour is not set', () => {
        childInstanceAuto.scrollLeft(100);
        const event = new WheelEvent('wheel', {
            deltaX: 0,
            deltaY: 25,
            shiftKey: true,
            bubbles: true,
            cancelable: true,
        });

        childAuto.dispatchEvent(event);

        expect(parent.scrollLeft).toBe(25);
        expect(childAuto.scrollLeft).toBe(100);
    });

    it('should not do x-scroll-chaining scrolling left if xScrollBehaviour is set to "none"', () => {
        childInstanceNone.scrollLeft(100);
        const event = new WheelEvent('wheel', {
            deltaX: 0,
            deltaY: 25,
            shiftKey: true,
            bubbles: true,
            cancelable: true,
        });

        childNone.dispatchEvent(event);

        expect(parent.scrollLeft).toBe(0);
        expect(childNone.scrollLeft).toBe(100);
    });

    it('should do y-scroll-chaining scrolling top if yScrollBehaviour is not set', () => {
        instance.scrollTop(50);
        const event = new WheelEvent('wheel', {
            deltaX: 0,
            deltaY: -25,
            bubbles: true,
            cancelable: true,
        });

        childAuto.dispatchEvent(event);

        expect(parent.scrollTop).toBe(25);
        expect(childAuto.scrollTop).toBe(0);
    });

    it('should not do y-scroll-chaining scrolling top if yScrollBehaviour is set to "none"', () => {
        instance.scrollTop(50);
        const event = new WheelEvent('wheel', {
            deltaX: 0,
            deltaY: -25,
            bubbles: true,
            cancelable: true,
        });

        childNone.dispatchEvent(event);

        expect(parent.scrollTop).toBe(50);
        expect(childNone.scrollTop).toBe(0);
    });

    it('should do y-scroll-chaining scrolling down if yScrollBehaviour is not set', () => {
        childInstanceAuto.scrollTop(100);
        const event = new WheelEvent('wheel', {
            deltaX: 0,
            deltaY: 25,
            bubbles: true,
            cancelable: true,
        });

        childAuto.dispatchEvent(event);

        expect(parent.scrollTop).toBe(25);
        expect(childAuto.scrollTop).toBe(100);
    });

    it('should not do y-scroll-chaining scrolling down if yScrollBehaviour is set to "none"', () => {
        childInstanceNone.scrollTop(100);
        const event = new WheelEvent('wheel', {
            deltaX: 0,
            deltaY: 25,
            bubbles: true,
            cancelable: true,
        });

        childNone.dispatchEvent(event);

        expect(parent.scrollTop).toBe(0);
        expect(childNone.scrollTop).toBe(100);
    });
});
