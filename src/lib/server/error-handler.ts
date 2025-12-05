import { ClientResponseError } from "pocketbase"
import { BusinessError } from "./business-errors"
import type { Logger } from "winston";

// handle Pocketbase Logic error
export const handlePocketbaseLogicError = (err: ClientResponseError, logger: Logger) => {
    // Pocketbase Logic error
    if(err.status >= 400) {
        logger.error('Pocketbase business error', {err});
        throw new BusinessError(err.status, err.message);
    }
    else {
        throw err;
    }
}

export const handlePocketbaseError = (err: ClientResponseError, logger: Logger) => {
    // handle other Pocketbase error
    if(err.status === 0){
        logger.error('Error connecting to Pocketbase', {err});
    }
    else {
        logger.error('Pocketbase error: ', {err});
    }
}