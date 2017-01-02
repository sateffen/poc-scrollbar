import ScrollContainer from '../src/scrollcontainer';

describe('Scroll by scrollbar', () => {
    [true, false].forEach((canScroll) => {
        describe(`is ${canScroll ? '' : 'not'} allowed`, () => {
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
                child.style.width = '200px';

                parent.appendChild(child);
                document.body.appendChild(parent);
                jasmine.clock().install();
                instance = new ScrollContainer(parent, {
                    xElementClass: ['scrollbar', 'horizontal'],
                    yElementClass: ['scrollbar', 'vertical'],
                    disableInteractionWithScrollbars: !canScroll,
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

            it('should scroll vertically if the vertical scrollbar is moved with the mouse', () => {
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

                verticalScrollbar.dispatchEvent(startEvent);
                document.body.dispatchEvent(moveEvent);
                document.body.dispatchEvent(stopEvent);

                expect(parent.scrollTop).toBe(canScroll ? 50 : 0);
                expect(parent.scrollLeft).toBe(0);
            });

            it('should scroll horizontally if the horizontal scrollbar is moved with the mouse', () => {
                const startEvent = new MouseEvent('mousedown', {
                    clientX: 10,
                    clientY: 0,
                });
                const moveEvent = new MouseEvent('mousemove', {
                    clientX: 35,
                    clientY: 10,
                });
                const stopEvent = new MouseEvent('mouseup', {
                    clientX: 35,
                    clientY: 10,
                });

                horizontalScrollbar.dispatchEvent(startEvent);
                document.body.dispatchEvent(moveEvent);
                document.body.dispatchEvent(stopEvent);

                expect(parent.scrollTop).toBe(0);
                expect(parent.scrollLeft).toBe(canScroll ? 50 : 0);
            });

            it('should scroll vertically if the vertical scrollbar is moved with the finger', () => {
                const startEvent = new TouchEvent('touchstart', {
                    touches: [
                        new Touch({
                            identifier: 0,
                            target: verticalScrollbar,
                            clientX: 0,
                            clientY: 10,
                        })
                    ]
                });
                const moveEvent = new TouchEvent('touchmove', {
                    touches: [
                        new Touch({
                            identifier: 0,
                            target: verticalScrollbar,
                            clientX: 10,
                            clientY: 35,
                        })
                    ]
                });
                const stopEvent = new TouchEvent('touchend', {
                    touches: [
                        new Touch({
                            identifier: 0,
                            target: verticalScrollbar,
                            clientX: 10,
                            clientY: 35,
                        })
                    ]
                });

                verticalScrollbar.dispatchEvent(startEvent);
                document.body.dispatchEvent(moveEvent);
                document.body.dispatchEvent(stopEvent);

                expect(parent.scrollTop).toBe(canScroll ? 50 : 0);
                expect(parent.scrollLeft).toBe(0);
            });

            it('should scroll horizontally if the horizontal scrollbar is moved with the finger', () => {
                const startEvent = new TouchEvent('touchstart', {
                    touches: [
                        new Touch({
                            identifier: 0,
                            target: horizontalScrollbar,
                            clientX: 10,
                            clientY: 0,
                        })
                    ]
                });
                const moveEvent = new TouchEvent('touchmove', {
                    touches: [
                        new Touch({
                            identifier: 0,
                            target: horizontalScrollbar,
                            clientX: 35,
                            clientY: 10,
                        })
                    ]
                });
                const stopEvent = new TouchEvent('touchend', {
                    touches: [
                        new Touch({
                            identifier: 0,
                            target: horizontalScrollbar,
                            clientX: 35,
                            clientY: 10,
                        })
                    ]
                });

                horizontalScrollbar.dispatchEvent(startEvent);
                document.body.dispatchEvent(moveEvent);
                document.body.dispatchEvent(stopEvent);

                expect(parent.scrollTop).toBe(0);
                expect(parent.scrollLeft).toBe(canScroll ? 50 : 0);
            });
        });
    });
});