import type { Logger } from "winston";
import PocketBase from 'pocketbase';
import { handleServiceError } from "./error-handler";
import { Collections, type UsersResponse } from "$lib/types/pocketbase-types";
import type { UserInfo, UserLoginPayload, UserRegisterPayload, UserRegisterResult } from "$lib/types/user-authen-types";


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
        throw handleServiceError(err, logger);
    }
}

export const addUser = async(registerPayload: UserRegisterPayload, 
    pbClient: PocketBase, logger: Logger
): Promise<UserRegisterResult> => {
    try {
        const registerRes = await pbClient.collection(Collections.Users)
            .create<UsersResponse>(registerPayload);
        return {
            id: registerRes.id,
            username: registerRes.username
        }
    } catch (err) {
        throw handleServiceError(err, logger);
    }
}