export interface Success<T> {
    success: boolean;
    value: T;
}

export interface Faliure<T> {
    error: number;
    message: T;
}