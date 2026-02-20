import { ClientResponseError } from "pocketbase"
import { AuthenticationError, BusinessError } from "./business-errors"
import type { Logger } from "winston";

// handle Pocketbase Logic error
export const handlePocketbaseLogicError = (err: ClientResponseError, logger: Logger) => {
    // Pocketbase Logic error
    if(err.status >= 400) {
        logger.error('Pocketbase business error: ', err);
        throw new BusinessError(err.status, err.message, err.data);
    }
    else {
        throw err;
    }
}

// handle Pocketbase batch error
export const handlePocketbaseBatchError = (err: ClientResponseError, logger: Logger) => {
    if(err.status >= 400) {
        logger.error('Pocketbase batch error: ', err);
        console.log('batch err: ', err);
        const requests = err.response?.data?.requests;

        if (requests) {
            const firstIdx = Object.keys(requests)[0];
            const firstFailedReq = requests[firstIdx];

            const validationErr = firstFailedReq?.response?.data;
            if (!validationErr) {
                throw new BusinessError(
                    err.status, 
                    firstFailedReq?.message || "Validation failed", 
                    err.data
                );
            }
            const field = Object.keys(validationErr)[0];
            const fieldErr = validationErr[field];
            const errMsg = `${field}: ${fieldErr.message}`;
            
            throw new BusinessError(
                err.status,
                `Error: ${errMsg}`,
                err.data
            );
        }
        throw new BusinessError(err.status, err.message, err.data);
    } else {
        throw err;
    }
}

export const handlePocketbaseAuthenError = (err: ClientResponseError, logger: Logger) => {
    // Pocketbase authentication error
    if(err.status == 400) {
        logger.error('Pocketbase authentication failed: ', err);
        throw new AuthenticationError(err.status, 'Invalid credentials', err.data);
    }
    else {
        throw err;
    }
}

export const handlePocketbaseError = (err: ClientResponseError, logger: Logger) => {
    // handle other Pocketbase error
    if(err.status === 0){
        logger.error('Error connecting to Pocketbase: ', err);
    }
    else {
        logger.error('Pocketbase error: ', err);
    }
}