import { makeObservable } from './make-observable';
import { Observer } from 'rxjs';


describe('makeObservable', () => {
    it('MakeObservable Will Defined', () => {
        const _promiseString = new Promise(res => res('test string'));
        const _promiseNumber = new Promise(res => res(1));
        const _promiseError = new Promise((res, rej) => rej(new Error('Error')));

        const observableWithString = makeObservable(_promiseString);
        expect(observableWithString).toBeDefined();
        makeObservable(_promiseString).subscribe(response => {
            expect(response).toEqual('test string');
        });

        const observableWithNumber = makeObservable(_promiseNumber);
        observableWithNumber.subscribe(response => {
            expect(response).toEqual(1);
        })

        const observableWithError = makeObservable(_promiseError);
        const observer: Observer<any> = {

            next: (value: any) => {
                expect(value).toHaveBeenCalledTimes(0);
            },
            error: (err: any) => {
                expect(err.message).toEqual('Error');
            },
            complete: () => { void 0; },
        };
        observableWithError.subscribe(observer);
    });


});