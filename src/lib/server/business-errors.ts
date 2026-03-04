
export enum ErrorCode {
    SUCCESS = 'SUCCESS',
    AUTH_FAILED = 'AUTH_FAILED',
    VALIDATION_FAILED = 'VALIDATION_FAILED',
    BATCH_FAILED = 'BATCH_FAILED',
    SEARCH_FAILED = 'SEARCH_FAILED',
    NOT_FOUND = 'NOT_FOUND',
    FORBIDDEN = 'FORBIDDEN',
    INTERNAL_ERROR = 'INTERNAL_ERROR'
}

// Application error class
export class AppError extends Error {
    status: number;
    code: string;
    data?: any;
    constructor(
        message: string, 
        status: number = 500, 
        code: string = ErrorCode.INTERNAL_ERROR, 
        data?:any
    ) {
        super(message);
        this.status = status;
        this.code = code;
        this.data = data;
    }
}

// Error related to business logic
export class BusinessError extends Error {
    statusCode: number;
    data?: any;
    constructor(statusCode: number, message: string, data?: any) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        this.data = data;
    }
}

// Authentication error
export class AuthenticationError extends Error {
    statusCode: number;
    data?: any;
    constructor(statusCode: number, message: string, data?: any) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        this.data = data;
    }
}