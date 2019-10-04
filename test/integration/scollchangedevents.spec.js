import PocScrollbar from '../../src/pocscrollbar';

describe('Scoll changed events', () => {
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
        instance = new PocScrollbar(parent, {
            xElementClass: ['scrollbar', 'horizontal'],
            yElementClass: ['scrollbar', 'vertical'],
        });

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
    });

    it('should not throw an error adding an eventlistener for scrollTopChanged event', () => {
        const spyCallback = jasmine.createSpy('spyCallback');
        const callback = () => instance.addEventListener('scrollTopChanged', spyCallback);

        expect(callback).not.toThrow();
    });

    it('should not throw an error adding an eventlistener for scrollLeftChanged event', () => {
        const spyCallback = jasmine.createSpy('spyCallback');
        const callback = () => instance.addEventListener('scrollLeftChanged', spyCallback);

        expect(callback).not.toThrow();
    });

    it('should throw an error adding an eventlistener for an unknown event', () => {
        const spyCallback = jasmine.createSpy('spyCallback');
        const callback = () => instance.addEventListener('unknown', spyCallback);

        expect(callback).toThrow();
    });

    it('should call the scrollTopChanged callback when scrollTop changed', () => {
        const spyCallback = jasmine.createSpy('spyCallback');

        instance.addEventListener('scrollTopChanged', spyCallback);

        expect(spyCallback).not.toHaveBeenCalled();
        instance.scrollTop(10);
        expect(spyCallback).toHaveBeenCalledTimes(1);
    });

    it('should call the scrollLeftChanged callback when scrollLeft changed', () => {
        const spyCallback = jasmine.createSpy('spyCallback');

        instance.addEventListener('scrollLeftChanged', spyCallback);

        expect(spyCallback).not.toHaveBeenCalled();
        instance.scrollLeft(10);
        expect(spyCallback).toHaveBeenCalledTimes(1);
    });

    it('should not call the scrollTopChanged callback when scrollLeft changed', () => {
        const spyCallback = jasmine.createSpy('spyCallback');

        instance.addEventListener('scrollTopChanged', spyCallback);
        instance.scrollLeft(10);
        expect(spyCallback).not.toHaveBeenCalled();
    });

    it('should not call the scrollLeftChanged callback when scrollTop changed', () => {
        const spyCallback = jasmine.createSpy('spyCallback');

        instance.addEventListener('scrollLeftChanged', spyCallback);
        instance.scrollTop(10);
        expect(spyCallback).not.toHaveBeenCalled();
    });

    it('should execute the scrollTop change if the event does not prevent default behaviour', () => {
        instance.addEventListener('scrollTopChanged', () => {});
        instance.scrollTop(10);
        expect(instance.scrollTop()).toBe(10);
    });

    it('should execute the scrollLeft change if the event does not prevent default behaviour', () => {
        instance.addEventListener('scrollLeftChanged', () => {});
        instance.scrollLeft(10);
        expect(instance.scrollLeft()).toBe(10);
    });

    it('should not execute the scrollTop change if the event prevents default behaviour', () => {
        instance.addEventListener('scrollTopChanged', (aEvent) => aEvent.preventDefault());
        instance.scrollTop(10);
        expect(instance.scrollTop()).toBe(0);
    });

    it('should not execute the scrollLeft change if the event prevents default behaviour', () => {
        instance.addEventListener('scrollLeftChanged', (aEvent) => aEvent.preventDefault());
        instance.scrollLeft(10);
        expect(instance.scrollLeft()).toBe(0);
    });

    it('should not propagate the event any further if propagation is stopped for scrollTopChanged events', () => {
        const spyCallback = jasmine.createSpy('spyCallback');

        instance.addEventListener('scrollTopChanged', (aEvent) => aEvent.stopPropagation());
        instance.addEventListener('scrollTopChanged', spyCallback);
        instance.scrollTop(10);
        expect(spyCallback).not.toHaveBeenCalled();
    });

    it('should not propagate the event any further if propagation is stopped for scrollLeftChanged events', () => {
        const spyCallback = jasmine.createSpy('spyCallback');

        instance.addEventListener('scrollLeftChanged', (aEvent) => aEvent.stopPropagation());
        instance.addEventListener('scrollLeftChanged', spyCallback);
        instance.scrollLeft(10);
        expect(spyCallback).not.toHaveBeenCalled();
    });

    it('should pass the correct event type to scrollTopChanged eventhandler', () => {
        let event = {};

        instance.addEventListener('scrollTopChanged', (aEvent) => event = aEvent);
        instance.scrollTop(10);
        expect(event.type).toBe('scrollTopChanged');
    });

    it('should pass the correct event type to scrollLeftChanged eventhandler', () => {
        let event = {};

        instance.addEventListener('scrollLeftChanged', (aEvent) => event = aEvent);
        instance.scrollLeft(10);
        expect(event.type).toBe('scrollLeftChanged');
    });

    it('should pass along the exepcted pixel change values to scrollTopChanged eventhandler', () => {
        const oldValue = 5;
        const newValue = 15;
        let event = {};

        instance.scrollTop(oldValue);
        instance.addEventListener('scrollTopChanged', (aEvent) => event = aEvent);
        instance.scrollTop(newValue);
        expect(event.oldValue).toBe(oldValue);
        expect(event.newValue).toBe(newValue);
        expect(event.delta).toBe(newValue - oldValue);
    });

    it('should pass along the exepcted pixel change values to scrollLeftChanged eventhandler', () => {
        const oldValue = 15;
        const newValue = 25;
        let event = {};

        instance.scrollLeft(oldValue);
        instance.addEventListener('scrollLeftChanged', (aEvent) => event = aEvent);
        instance.scrollLeft(newValue);
        expect(event.oldValue).toBe(oldValue);
        expect(event.newValue).toBe(newValue);
        expect(event.delta).toBe(newValue - oldValue);
    });

    it('should pass the scollcontainer as srcElement in scrollTopChanged event object', () => {
        let event = {};

        instance.addEventListener('scrollTopChanged', (aEvent) => event = aEvent);
        instance.scrollTop(10);
        expect(event.srcElement).toBe(parent);
    });

    it('should pass the scollcontainer as srcElement in scrollLeftChanged event object', () => {
        let event = {};

        instance.addEventListener('scrollLeftChanged', (aEvent) => event = aEvent);
        instance.scrollLeft(10);
        expect(event.srcElement).toBe(parent);
    });

    it('should pass the correct scrollbar as target in scrollTopChanged event object', () => {
        let event = {};

        instance.addEventListener('scrollTopChanged', (aEvent) => event = aEvent);
        instance.scrollTop(10);
        expect(event.target).toBe(verticalScrollbar);
    });

    it('should pass the correct scrollbar as target in scrollLeftChanged event object', () => {
        let event = {};

        instance.addEventListener('scrollLeftChanged', (aEvent) => event = aEvent);
        instance.scrollLeft(10);
        expect(event.target).toBe(horizontalScrollbar);
    });
});
