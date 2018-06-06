import PocScrollbar from '../../src/pocscrollbar';

describe('Scrollbar Setup', () => {
    let instance = null;
    let parent = null;
    let child = null;
    let verticalScrollbar = null;

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
        instance = new PocScrollbar(parent, {
            xElementClass: ['scrollbar', 'horizontal'],
            yElementClass: ['scrollbar', 'vertical'],
        });

        verticalScrollbar = parent.querySelector('.scrollbar.vertical');
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

    it('should not trigger an global error when destroying the scrollbar while scrolling with the mouse', () => {
        const windowErrorSpy = jasmine.createSpy();
        const startEvent = new MouseEvent('mousedown', {
            clientX: 0,
            clientY: 10,
        });
        const moveEvent = new MouseEvent('mousemove', {
            clientX: 10,
            clientY: 35,
        });
        const stopEvent = new MouseEvent('mouseup', {
            clientX: 10,
            clientY: 35,
        });

        window.addEventListener('error', windowErrorSpy);

        verticalScrollbar.dispatchEvent(startEvent);
        instance.destroy();
        document.body.dispatchEvent(moveEvent);
        document.body.dispatchEvent(stopEvent);

        expect(windowErrorSpy).not.toHaveBeenCalled();
        window.removeEventListener('error', windowErrorSpy);
    });

    it('should not trigger an global error when destroying the scrollbar while scrolling with the touch on scrollbar', () => {
        const windowErrorSpy = jasmine.createSpy();
        const startEvent = new TouchEvent('touchstart', {
            which: 0,
            touches: [
                new Touch({
                    identifier: 0,
                    target: parent,
                    clientX: 35,
                    clientY: 50,
                }),
            ],
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
            ],
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
            ],
        });

        window.addEventListener('error', windowErrorSpy);

        verticalScrollbar.dispatchEvent(startEvent);
        instance.destroy();
        document.body.dispatchEvent(moveEvent);
        document.body.dispatchEvent(stopEvent);

        expect(windowErrorSpy).not.toHaveBeenCalled();
        window.removeEventListener('error', windowErrorSpy);
    });

    it('should not trigger an global error when destroying the scrollbar while scrolling with the touch on parent', () => {
        const windowErrorSpy = jasmine.createSpy();
        const startEvent = new TouchEvent('touchstart', {
            which: 0,
            touches: [
                new Touch({
                    identifier: 0,
                    target: parent,
                    clientX: 35,
                    clientY: 50,
                }),
            ],
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
            ],
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
            ],
        });

        window.addEventListener('error', windowErrorSpy);

        parent.dispatchEvent(startEvent);
        instance.destroy();
        document.body.dispatchEvent(moveEvent);
        document.body.dispatchEvent(stopEvent);

        expect(windowErrorSpy).not.toHaveBeenCalled();
        window.removeEventListener('error', windowErrorSpy);
    });
});
