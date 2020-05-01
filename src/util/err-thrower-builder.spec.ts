import { errThrowerBuilder } from './err-thrower-builder'


const mockFn = jest.fn();

const mockErrorBuilder = mockFn.bind(errThrowerBuilder);
console.dir(mockErrorBuilder);


describe('Error-Thrower-Builder', () => {
    it('Typeof-Thrower', () => {
        expect(Object.prototype.toString.call(errThrowerBuilder)).toEqual('[object Function]');
    })
})