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