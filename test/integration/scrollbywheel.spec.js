import PocScrollbar from '../../src/pocscrollbar';

describe('Scroll by wheel', () => {
    let instance = null;
    let parent = null;
    let child = null;

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
        instance = new PocScrollbar(parent, {
            xElementClass: ['scrollbar', 'horizontal'],
            yElementClass: ['scrollbar', 'vertical'],
        });
        jasmine.clock().tick(301);
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
            bubbles: true,
            cancelable: true,
        });

        parent.dispatchEvent(event);

        expect(parent.scrollTop).toBe(25);
        expect(parent.scrollLeft).toBe(0);
    });

    it('should react on wheel scroll left events', () => {
        const event = new WheelEvent('wheel', {
            deltaX: 0,
            deltaY: 25,
            shiftKey: true,
            bubbles: true,
            cancelable: true,
        });

        parent.dispatchEvent(event);

        expect(parent.scrollTop).toBe(0);
        expect(parent.scrollLeft).toBe(0);
    });

    it('should react on wheel scroll down events with bigger child', () => {
        child.style.width = '200px';
        jasmine.clock().tick(301);
        const event = new WheelEvent('wheel', {
            deltaX: 0,
            deltaY: 25,
            bubbles: true,
            cancelable: true,
        });

        parent.dispatchEvent(event);

        expect(parent.scrollTop).toBe(25);
        expect(parent.scrollLeft).toBe(0);
    });

    it('should react on wheel scroll left events with bigger child', () => {
        child.style.width = '200px';
        jasmine.clock().tick(301);
        const event = new WheelEvent('wheel', {
            deltaX: 0,
            deltaY: 25,
            shiftKey: true,
            bubbles: true,
            cancelable: true,
        });

        parent.dispatchEvent(event);

        expect(parent.scrollTop).toBe(0);
        expect(parent.scrollLeft).toBe(25);
    });
});
