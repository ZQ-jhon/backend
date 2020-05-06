import { from } from 'rxjs';

export const makeObservable = <T>(promise: Promise<T>) => from(promise);
