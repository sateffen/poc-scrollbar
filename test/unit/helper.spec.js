import {DOM_DELTA_LINE, DOM_DELTA_PAGE, DOM_DELTA_PIXEL, BROWSER_LINE_HEIGHT} from '../../src/constants';
import {debounce, applyOptionsToScrollBarElement, getWheelDeltaAsPixel} from '../../src/helper';

const originalWindowSetTimeout = window.setTimeout;
const originalWindowClearTimeout = window.clearTimeout;

describe('Helper functions', () => {
    describe('applyOptionsToScrollBarElement', () => {
        it('should be a function', () => {
            expect(typeof applyOptionsToScrollBarElement).toBe('function');
        });
    });

    describe('getWheelDeltaAsPixel', () => {
        const scrollContainer = {clientWidth: 200, clientHeight: 100};

        it('should be a function', () => {
            expect(typeof getWheelDeltaAsPixel).toBe('function');
        });

        it('should return the deltaOption value if provided for X=true', () => {
            const deltaOptionValue = Math.random();
            const result = getWheelDeltaAsPixel(true, deltaOptionValue, DOM_DELTA_LINE, 4, scrollContainer);

            expect(result).toBe(deltaOptionValue);
        });

        it('should return the deltaOption value if provided for X=false', () => {
            const deltaOptionValue = Math.random();
            const result = getWheelDeltaAsPixel(false, deltaOptionValue, DOM_DELTA_LINE, 4, scrollContainer);

            expect(result).toBe(deltaOptionValue);
        });

        it('should return the deltaValue if the deltaMode is unknown', () => {
            const deltaValue = Math.random();
            const result = getWheelDeltaAsPixel(false, undefined, 'unknown', deltaValue, scrollContainer);

            expect(result).toBe(deltaValue);
        });

        it('should return the expected result if the deltaMode is DOM_DELTA_PIXEL for X=true', () => {
            const deltaValue = Math.random();
            const result = getWheelDeltaAsPixel(true, undefined, DOM_DELTA_PIXEL, deltaValue, scrollContainer);

            expect(result).toBe(deltaValue);
        });

        it('should return the expected result if the deltaMode is DOM_DELTA_PIXEL for X=false', () => {
            const deltaValue = Math.random();
            const result = getWheelDeltaAsPixel(false, undefined, DOM_DELTA_PIXEL, deltaValue, scrollContainer);

            expect(result).toBe(deltaValue);
        });

        it('should return the expected result if the deltaMode is DOM_DELTA_PAGE for X=true', () => {
            const deltaValue = 0.5;
            const result = getWheelDeltaAsPixel(true, undefined, DOM_DELTA_PAGE, deltaValue, scrollContainer);

            expect(result).toBe(deltaValue * scrollContainer.clientWidth);
        });

        it('should return the expected result if the deltaMode is DOM_DELTA_PAGE for X=false', () => {
            const deltaValue = 0.5;
            const result = getWheelDeltaAsPixel(false, undefined, DOM_DELTA_PAGE, deltaValue, scrollContainer);

            expect(result).toBe(deltaValue * scrollContainer.clientHeight);
        });

        it('should return the expected result if the deltaMode is DOM_DELTA_LINE for X=true', () => {
            const deltaValue = 5;
            const result = getWheelDeltaAsPixel(true, undefined, DOM_DELTA_LINE, deltaValue, scrollContainer);

            expect(result).toBe(deltaValue * BROWSER_LINE_HEIGHT);
        });

        it('should return the expected result if the deltaMode is DOM_DELTA_LINE for X=false', () => {
            const deltaValue = 6;
            const result = getWheelDeltaAsPixel(false, undefined, DOM_DELTA_LINE, deltaValue, scrollContainer);

            expect(result).toBe(deltaValue * BROWSER_LINE_HEIGHT);
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

        it('should return an array with two functions', () => {
            const returnValue = debounce();

            expect(Array.isArray(returnValue)).toBe(true);
            expect(returnValue.length).toBe(2);
            expect(typeof returnValue[0]).toBe('function');
            expect(typeof returnValue[1]).toBe('function');
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
            debounce()[0]();
            expect(window.clearTimeout).toHaveBeenCalledTimes(1);
            expect(window.clearTimeout).toHaveBeenCalledWith(null);
        });

        it('should call clearTimeout with the returned setTimeout pointer from prev call at second call', () => {
            const [callback] = debounce();
            callback();
            callback();

            expect(window.clearTimeout).toHaveBeenCalledTimes(2);
            expect(window.clearTimeout.calls.mostRecent().args[0]).toBe(setTimeoutReturnValue);
        });

        it('should have called clearTimeout when calling the destroyCallback', () => {
            debounce()[1]();
            expect(window.clearTimeout).toHaveBeenCalledTimes(1);
            expect(window.clearTimeout).toHaveBeenCalledWith(null);
        });

        it('should call setTimeout with a function as first argument and the given time as second argument', () => {
            const spyCallback = jasmine.createSpy('spyCallback');
            const waitTime = Math.round(Math.random() * 100);
            debounce(spyCallback, waitTime)[0]();

            expect(window.setTimeout).toHaveBeenCalledTimes(1);
            expect(window.setTimeout).toHaveBeenCalledWith(spyCallback, waitTime);
        });
    });
});
