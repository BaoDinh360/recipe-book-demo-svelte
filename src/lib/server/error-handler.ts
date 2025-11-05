import { ClientResponseError } from "pocketbase"
import { BusinessError } from "./business-errors"

// handle Pocketbase Logic error
export const handlePocketbaseError = (err: ClientResponseError) => {
    // 0: connection error
    if(err.status !== 0) {
        console.log('Pocketbase error res: ', err.response);
        throw new BusinessError(err.status, err.message);
    }
}