import { errThrowerBuilder } from './err-thrower-builder'
import { HttpStatus } from '@nestjs/common';

const mockFn = (arr: [Error, string, HttpStatus]) => errThrowerBuilder(...arr);


describe('Error-Thrower-Builder', () => {
    it('Typeof-Thrower', () => {
        expect(Object.prototype.toString.call(errThrowerBuilder)).toEqual('[object Function]');
        mockFn([new Error('some error'), 'error throwing', HttpStatus.FORBIDDEN]).toPromise().catch(err => {
            expect(err.message).toContain('some error');
            expect(err.message).toContain('error throwing');
            expect(err.status).toEqual(HttpStatus.FORBIDDEN);
        });

    });
})