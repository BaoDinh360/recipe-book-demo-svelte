import { ClientResponseError } from "pocketbase"
import { AppError, AuthenticationError, BusinessError, ErrorCode } from "./business-errors"
import type { Logger } from "winston";

// handle Pocketbase Logic error
// export const handlePocketbaseLogicError = (err: ClientResponseError, logger: Logger) => {
//     // Pocketbase Logic error
//     if(err.status >= 400) {
//         logger.error('Pocketbase business error: ', err);
//         throw new BusinessError(err.status, err.message, err.data);
//     }
//     else {
//         throw err;
//     }
// }

// handle Pocketbase batch error
// export const handlePocketbaseBatchError = (err: ClientResponseError, logger: Logger) => {
//     if(err.status >= 400) {
//         logger.error('Pocketbase batch error: ', err);
//         console.log('batch err: ', err);
//         const requests = err.response?.data?.requests;

//         if (requests) {
//             const firstIdx = Object.keys(requests)[0];
//             const firstFailedReq = requests[firstIdx];

//             const validationErr = firstFailedReq?.response?.data;
//             if (!validationErr) {
//                 throw new BusinessError(
//                     err.status, 
//                     firstFailedReq?.message || "Validation failed", 
//                     err.data
//                 );
//             }
//             const field = Object.keys(validationErr)[0];
//             const fieldErr = validationErr[field];
//             const errMsg = `${field}: ${fieldErr.message}`;
            
//             throw new BusinessError(
//                 err.status,
//                 `Error: ${errMsg}`,
//                 err.data
//             );
//         }
//         throw new BusinessError(err.status, err.message, err.data);
//     } else {
//         throw err;
//     }
// }

// export const handlePocketbaseAuthenError = (err: ClientResponseError, logger: Logger) => {
//     // Pocketbase authentication error
//     if(err.status == 400) {
//         logger.error('Pocketbase authentication failed: ', err);
//         throw new AuthenticationError(err.status, 'Invalid credentials', err.data);
//     }
//     else {
//         throw err;
//     }
// }

// export const handlePocketbaseError = (err: ClientResponseError, logger: Logger) => {
//     // handle other Pocketbase error
//     if(err.status === 0){
//         logger.error('Error connecting to Pocketbase: ', err);
//     }
//     else {
//         logger.error('Pocketbase error: ', err);
//     }
// }

// handle pocketbase batch error
const handlePocketbaseBatchError = (err: ClientResponseError, logger: Logger) => {
    // batch 403 error
    if (err.status == 403) {
        logger.error('Pocketbase batch req permission error: ', err);
        return new AppError('Permission required', 400, ErrorCode.FORBIDDEN);
    }
    // batch 400 error
    const requests = err.response?.data?.requests;
    
    if(!requests) {
        return new AppError(
            err.message,
            400,
            ErrorCode.VALIDATION_FAILED
        )
    }

    const firstIdx = Object.keys(requests)[0];
    const firstFailedReq = requests[firstIdx];
    const validationErr = firstFailedReq?.response?.data;
    // if not validation error
    if (!validationErr) {
        logger.error('Pocketbase batch error: ', err);
        return new AppError(
            firstFailedReq?.message || 'Validation failed',
            400,
            ErrorCode.VALIDATION_FAILED,
            err.data
        );
    }
    // batch validation error
    const field = Object.keys(validationErr)[0];
    const fieldErr = validationErr[field];
    const errMsg = `${field} - ${fieldErr.message}`;
    logger.error('Pocketbase batch req validation error: ', err);
    return new AppError(
        `Error: ${errMsg}`,
        400,
        ErrorCode.VALIDATION_FAILED,
        err.data
    )
}

// handle pocketbase related error
const handlePocketbaseError = (err: ClientResponseError, logger: Logger) => {
    const url = err.url || '';
    const hasErrData = Object.keys(err.response.data || {}).length > 0;
    // handle pocketbase batch error
    if (url.includes('/batch')) {
        handlePocketbaseBatchError(err, logger);
    }    

    // handle pocketbase 400 error
    if (err.status === 400) {
        // authen error
        if (url.includes('/auth-with-password')) {
            logger.error('Pocketbase authentication req error: ', err);
            return new AppError('Invalid credentials', 401, ErrorCode.AUTH_FAILED, err.data);
        }
        // list/search error
        if (url.includes('/records') && !hasErrData) {
            logger.error('Pocketbase search req error: ', err);
            return new AppError(
                `Search failed: ${err.message}`, 
                400, ErrorCode.SEARCH_FAILED, err.data);
        }
        // validation error
        if (hasErrData) {
            logger.error('Pocketbase req validation error: ', err);
            const errData = err.response?.data;
            const field = Object.keys(errData)[0];
            const fieldErr = errData[field];
            const errMsg = `${field} - ${fieldErr.message}`;
            return new AppError(
                `Error: ${errMsg}`, 
                400, ErrorCode.VALIDATION_FAILED, err.data);
        }
    }
    if (err.status == 404) {
        logger.error('Pocketbase record not found: ', err);
        return new AppError('Not found', 400, ErrorCode.NOT_FOUND, err.data);
    }
    if (err.status == 403) {
        logger.error('Pocketbase req permission error: ', err);
        return new AppError('Permission required', 400, ErrorCode.FORBIDDEN, err.data);
    }
    // other pocketbase errors
    logger.error('Pocketbase error: ', err);
    return new AppError('Internal Db error: ', 500, ErrorCode.INTERNAL_ERROR, err.data);
    
}

export const handleServiceError = (err: any, logger: Logger) => {
    // handle pocketbase error
    if (err instanceof ClientResponseError) {
        return handlePocketbaseError(err, logger);
    }
    // handle other errors
    logger.error('An exception error occurs: ', err);
    return new AppError('Internal error', 500, ErrorCode.INTERNAL_ERROR);
}