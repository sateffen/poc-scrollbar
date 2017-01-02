import ScrollContainer from '../src/scrollcontainer';

describe('Scroll by wheel', () => {
    let instance = null;
    let parent = null;
    let child = null;
    let verticalScrollbar = null;
    let horizontalScrollbar = null;

    beforeEach(() => {
        instance = null;
        parent = document.createElement('div');
        child = document.createElement('div');

        parent.style.height = '100px';
        parent.style.width = '100px';
        child.style.height = '200px';
        child.style.width = '100px';

        parent.appendChild(child);
        document.body.appendChild(parent);
        jasmine.clock().install();
        instance = new ScrollContainer(parent, {
            xElementClass: ['scrollbar', 'horizontal'],
            yElementClass: ['scrollbar', 'vertical'],
            useInterval: true,
        });
        jasmine.clock().tick(301);

        verticalScrollbar = parent.querySelector('.scrollbar.vertical');
        horizontalScrollbar = parent.querySelector('.scrollbar.horizontal');
    });

    afterEach(() => {
        document.body.removeChild(parent);
        parent = null;
        child = null;

        if (instance) {
            instance.destroy();
            instance = null;
        }
        jasmine.clock().uninstall();
    });

    it('should react on wheel scroll down events', () => {
        const event = new WheelEvent('wheel', {
            deltaX: 0,
            deltaY: 25,
        });

        parent.dispatchEvent(event);

        expect(parent.scrollTop).toBe(25);
        expect(parent.scrollLeft).toBe(0);
    });

    it('should react on wheel scroll left events', () => {
        const event = new WheelEvent('wheel', {
            deltaX: 25,
            deltaY: 0,
        });

        parent.dispatchEvent(event);

        expect(parent.scrollTop).toBe(0);
        expect(parent.scrollLeft).toBe(0);
    });

    it('should react on wheel scroll down and left events', () => {
        const event = new WheelEvent('wheel', {
            deltaX: 25,
            deltaY: 25,
        });

        parent.dispatchEvent(event);

        expect(parent.scrollTop).toBe(25);
        expect(parent.scrollLeft).toBe(0);
    });

    it('should react on wheel scroll down and left events with bigger child', () => {
        child.style.width = '200px';
        jasmine.clock().tick(301);
        const event = new WheelEvent('wheel', {
            deltaX: 25,
            deltaY: 25,
        });

        parent.dispatchEvent(event);

        expect(parent.scrollTop).toBe(25);
        expect(parent.scrollLeft).toBe(25);
    });

    it('should react on wheel scroll down and left events with bigger child', () => {
        child.style.width = '200px';
        jasmine.clock().tick(301);
        const event = new WheelEvent('wheel', {
            deltaX: 50,
            deltaY: 100,
        });

        parent.dispatchEvent(event);

        // 50 is scrolled away, and 50/200 = 25/100 in viewport
        expect(horizontalScrollbar.style.left).toBe(`${50 + 25}px`);
        // 100 is scrolled away, and 100/200 = 50/100 in viewport
        expect(verticalScrollbar.style.top).toBe(`${100 + 50}px`);
    });
});