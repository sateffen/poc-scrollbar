import ScrollContainer from '../../src/scrollcontainer';

describe('Scroll by touch', () => {
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
        child.style.width = '200px';

        parent.appendChild(child);
        document.body.appendChild(parent);
        instance = new ScrollContainer(parent, {
            xElementClass: ['scrollbar', 'horizontal'],
            yElementClass: ['scrollbar', 'vertical'],
        });
    });

    afterEach(() => {
        document.body.removeChild(parent);
        parent = null;
        child = null;

        if (instance) {
            instance.destroy();
            instance = null;
        }
    });

    it('should scroll correctly when using touch events', () => {
        const startEvent = new TouchEvent('touchstart', {
            which: 0,
            touches: [
                new Touch({
                    identifier: 0,
                    target: parent,
                    clientX: 35,
                    clientY: 50,
                }),
            ]
        });
        const moveEvent = new TouchEvent('touchmove', {
            which: 0,
            touches: [
                new Touch({
                    identifier: 0,
                    target: parent,
                    clientX: 10,
                    clientY: 0,
                }),
            ]
        });
        const stopEvent = new TouchEvent('touchend', {
            which: 0,
            touches: [
                new Touch({
                    identifier: 0,
                    target: parent,
                    clientX: 10,
                    clientY: 0,
                }),
            ]
        });

        parent.dispatchEvent(startEvent);
        document.body.dispatchEvent(moveEvent);
        document.body.dispatchEvent(stopEvent);

        expect(parent.scrollTop).toBe(50);
        expect(parent.scrollLeft).toBe(25);
    });

    it('should not scroll when using touch events if disableTouchScrollingOnContainer is true', () => {
        instance.destroy();
        instance = new ScrollContainer(parent, {
            xElementClass: ['scrollbar', 'horizontal'],
            yElementClass: ['scrollbar', 'vertical'],
            disableTouchScrollingOnContainer: true,
            useInterval: true,
        });
        const startEvent = new TouchEvent('touchstart', {
            touches: [
                new Touch({
                    identifier: 0,
                    target: parent,
                    clientX: 50,
                    clientY: 35,
                }),
            ]
        });
        const moveEvent = new TouchEvent('touchmove', {
            touches: [
                new Touch({
                    identifier: 0,
                    target: parent,
                    clientX: 0,
                    clientY: 10,
                }),
            ]
        });
        const stopEvent = new TouchEvent('touchend', {
            touches: [
                new Touch({
                    identifier: 0,
                    target: parent,
                    clientX: 0,
                    clientY: 10,
                }),
            ]
        });

        parent.dispatchEvent(startEvent);
        document.body.dispatchEvent(moveEvent);
        document.body.dispatchEvent(stopEvent);

        expect(parent.scrollTop).toBe(0);
        expect(parent.scrollLeft).toBe(0);
    });
});