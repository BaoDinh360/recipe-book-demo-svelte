import { USERS } from "./pocketbase-client";
import type { Logger } from "winston";
import PocketBase, { ClientResponseError } from 'pocketbase';
import type { UserData } from "$lib/types/user-authen-types";
import { handlePocketbaseAuthenError } from "./error-handler";

const USER_COLLECTION = USERS;

export const authenticateUser = async(username: string, password: string,
    pbClient: PocketBase, logger: Logger
): Promise<UserData> => {
    try {
        const authenticatedData = await pbClient.collection(USER_COLLECTION).authWithPassword(
            username, password
        );
        const userData: UserData = {
            id: authenticatedData.record.id,
            email: authenticatedData.record.email,
            username: authenticatedData.record.username,
            name: authenticatedData.record.name,
            created: new Date(authenticatedData.record.created)
        };
        return userData;
    } catch (err) {
        // pocketbase error exception
        if(err instanceof ClientResponseError) {
            handlePocketbaseAuthenError(err, logger);
        }
        // re throw / bubble up other error
        throw err;
    }
}