import {ScrollView} from '../../src/scrollview';

describe('ScrollView', () => {
    describe('Constructor', () => {
        let parentInstance = null;
        let instance = null;
        let xElement = null;
        let yElement = null;

        beforeEach(() => {
            parentInstance = jasmine.createSpyObj('parentInstance', ['parentUpdated', 'scrollTop', 'scrollLeft']);
            parentInstance._container = document.createElement('div');
            xElement = document.createElement('div');
            yElement = document.createElement('div');

            spyOn(ScrollView.prototype, '_setupElement').and.returnValues(xElement, yElement);
            spyOn(ScrollView.prototype, 'parentUpdated');

            instance = new ScrollView(parentInstance, {});
        });

        it('should be a class', () => {
            expect(typeof ScrollView).toBe('function');
        });

        it('should be instance of ScrollView', () => {
            expect(instance instanceof ScrollView).toBe(true);
        });

        it('should call _setupElement for the X element', () => {
            expect(instance._setupElement).toHaveBeenCalledTimes(2);
            expect(instance._setupElement).toHaveBeenCalledWith(true);
            expect(instance._xElement).toBe(xElement);
        });

        it('should call _setupElement for the Y element', () => {
            expect(instance._setupElement).toHaveBeenCalledTimes(2);
            expect(instance._setupElement).toHaveBeenCalledWith(false);
            expect(instance._yElement).toBe(yElement);
        });

        it('should disable X if the option tells to', () => {
            instance._setupElement.calls.reset();

            instance = new ScrollView(parentInstance, {
                disableXScrolling: true,
            });

            expect(instance._setupElement).toHaveBeenCalledTimes(1);
            expect(instance._setupElement).toHaveBeenCalledWith(false);
            expect(instance._xElement).toBe(null);
        });

        it('should disable Y if the option tells to', () => {
            instance._setupElement.calls.reset();

            instance = new ScrollView(parentInstance, {
                disableYScrolling: true,
            });

            expect(instance._setupElement).toHaveBeenCalledTimes(1);
            expect(instance._setupElement).toHaveBeenCalledWith(true);
            expect(instance._yElement).toBe(null);
        });

        it('should call parentUpdated on constructor', () => {
            expect(instance.parentUpdated).toHaveBeenCalledTimes(1);
        });
    });
});
