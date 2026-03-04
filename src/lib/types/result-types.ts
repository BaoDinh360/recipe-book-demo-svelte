

export type ResultSuccess<T> = {
    readonly success: true;
    readonly data: T;
    readonly message?: string;
    readonly code?: string;
}
export type ResultFail = {
    readonly success: false;
    readonly message: string;
    readonly code: string;
    readonly status: number;
    readonly stack?: any;
}

export type Result<T = void> = ResultSuccess<T> | ResultFail;
export class ResultFactory {
    // success, no data overload
    static success(): ResultSuccess<void>;
    // success, has data overload
    static success<T>(data?: T, message?: string, code?: string): ResultSuccess<T>;
    // base imp
    static success<T>(data?: T, message?: string, code?: string): ResultSuccess<T | void> {
        return {
            success: true,
            data,
            message,
            code
        };
    }
    static fail(message: string, code: string, status: number, stack?: any): ResultFail {
        return {
            success: false,
            message,
            code,
            status,
            stack
        };
    }
}