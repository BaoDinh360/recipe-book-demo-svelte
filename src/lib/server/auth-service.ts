import type { Logger } from "winston";
import PocketBase, { ClientResponseError } from 'pocketbase';
import { handlePocketbaseAuthenError, handlePocketbaseBatchError } from "./error-handler";
import { Collections, type UsersResponse } from "$lib/types/pocketbase-types";
import type { UserInfo, UserLoginPayload, UserRegistrationPayload } from "$lib/types/user-authen-types";


export const authenticateUser = async(loginPayload: UserLoginPayload,
    pbClient: PocketBase, logger: Logger
): Promise<UserInfo> => {
    try {
        const { username, password } = loginPayload;
        const authResult = await pbClient.collection(Collections.Users)
            .authWithPassword<UsersResponse>(username, password);
        const userInfo: UserInfo = {
            id: authResult.record.id,
            email: authResult.record.email,
            username: authResult.record.username,
            name: authResult.record.name,
        };
        return userInfo;
    } catch (err) {
        // pocketbase error exception
        if(err instanceof ClientResponseError) {
            handlePocketbaseAuthenError(err, logger);
        }
        // re throw / bubble up other error
        throw err;
    }
}

export const registerUser = async(registerPayload: UserRegistrationPayload, 
    pbClient: PocketBase, logger: Logger
) => {
    try {
        const registerRes = await pbClient.collection(Collections.Users)
            .create<UsersResponse>(registerPayload);
        return {
            id: registerRes.id,
            username: registerRes.username
        }
    } catch (err) {
        // pocketbase error exception
        if(err instanceof ClientResponseError) {
            handlePocketbaseBatchError(err, logger);
        }
        // re throw / bubble up other error
        throw err;
    }
}