import PocScrollbar from '../../src/pocscrollbar';

describe('Scrollbar Setup', () => {
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
        instance = new PocScrollbar(parent, {
            xElementClass: ['scrollbar', 'horizontal'],
            yElementClass: ['scrollbar', 'vertical']
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

    it('should not change a height initializing the scrollbar', () => {
        expect(parent.style.height).toBe('100px');
        expect(parent.style.width).toBe('100px');
        expect(child.style.height).toBe('200px');
        expect(child.style.width).toBe('100px');
    });

    it('should add the expected scrollbars to the container', () => {
        expect(horizontalScrollbar instanceof Element).toBe(true);
        expect(verticalScrollbar instanceof Element).toBe(true);
    });

    it('should make the expected scrollbars visible', () => {
        expect(horizontalScrollbar.style.display).toBe('none');
        expect(verticalScrollbar.style.display).toBe('block');
    });

    it('should set the height and width as expected', () => {
        expect(horizontalScrollbar.style.height).toBe('0px');
        // we can't expect the horizontalScrollbar width, because it's uninitialized at this point
        expect(verticalScrollbar.style.width).toBe('0px');
        expect(verticalScrollbar.style.height).toBe('50px');
    });

    it('should not add a X scrollbar if disableXScrolling is true', () => {
        instance.destroy();
        instance = new PocScrollbar(parent, {
            xElementClass: ['scrollbar', 'horizontal'],
            yElementClass: ['scrollbar', 'vertical'],
            disableXScrolling: true
        });

        expect(parent.querySelector('.scrollbar.horizontal')).toBeNull();
    });

    it('should not add a Y scrollbar if disableYScrolling is true', () => {
        instance.destroy();
        instance = new PocScrollbar(parent, {
            xElementClass: ['scrollbar', 'horizontal'],
            yElementClass: ['scrollbar', 'vertical'],
            disableYScrolling: true
        });

        expect(parent.querySelector('.scrollbar.vertical')).toBeNull();
    });
});