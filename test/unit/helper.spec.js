import { debounce, applyOptionsToScollBarElement, generateEventHandlerForElement } from '../../src/helper';

const originalWindowSetTimeout = window.setTimeout;
const originalWindowClearTimeout = window.clearTimeout;

describe('Helper functions', () => {
    describe('generateEventHandlerForElement', () => {
        it('should be a function', () => {
            expect(typeof generateEventHandlerForElement).toBe('function');
        });

        it('should return an object calling the function', () => {
            expect(typeof generateEventHandlerForElement()).toBe('object');
        });

        it('should have the "mousedown" member on the returned object', () => {
            const returned = generateEventHandlerForElement();

            expect(typeof returned.mousedown).toBe('function');
        });

        it('should have the "touchstart" member on the returned object', () => {
            const returned = generateEventHandlerForElement();

            expect(typeof returned.touchstart).toBe('function');
        });
    });

    describe('applyOptionsToScollBarElement', () => {
        it('should be a function', () => {
            expect(typeof applyOptionsToScollBarElement).toBe('function');
        });
    });

    describe('debounce', () => {
        const setTimeoutReturnValue = Math.random();
        const clearTimeoutReturnValue = Math.random();
        beforeEach(() => {
            window.setTimeout = jasmine.createSpy('window.setTimeout').and.returnValue(setTimeoutReturnValue);
            window.clearTimeout = jasmine.createSpy('window.clearTimeout').and.returnValue(clearTimeoutReturnValue);
        });

        afterEach(() => {
            window.setTimeout = originalWindowSetTimeout;
            window.clearTimeout = originalWindowClearTimeout;
        });

        it('should be a function', () => {
            expect(typeof debounce).toBe('function');
        });

        it('should return a function', () => {
            expect(typeof debounce()).toBe('function');
        });

        it('should not call clearTimeout initially', () => {
            debounce();
            expect(window.clearTimeout).not.toHaveBeenCalled();
        });

        it('should not call setTimeout initially', () => {
            debounce();
            expect(window.setTimeout).not.toHaveBeenCalled();
        });

        it('should call clearTimeout with null on first call', () => {
            debounce()();
            expect(window.clearTimeout).toHaveBeenCalledTimes(1);
            expect(window.clearTimeout).toHaveBeenCalledWith(null);
        });

        it('should call clearTimeout with the returned setTimeout pointer from prev call at second call', () => {
            const callback = debounce();
            callback();
            callback();

            expect(window.clearTimeout).toHaveBeenCalledTimes(2);
            expect(window.clearTimeout.calls.mostRecent().args[0]).toBe(setTimeoutReturnValue);
        });

        it('should call setTimeout with a function as first argument and the given time as second argument', () => {
            const spyCallback = jasmine.createSpy('spyCallback');
            const waitTime = Math.round(Math.random() * 100);
            debounce(spyCallback, waitTime)();

            expect(window.setTimeout).toHaveBeenCalledWith(spyCallback, waitTime);
        });
    });
});
