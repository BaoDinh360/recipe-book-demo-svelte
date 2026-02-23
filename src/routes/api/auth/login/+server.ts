import { authenticateUser } from "$lib/server/auth-service"
import type { ApiResponse } from '$lib/types';
import type { UserLoginPayload } from "$lib/types/user-authen-types.js";
import { json } from '@sveltejs/kit'

// POST /api/auth/login
export const POST = async({ request, url, locals }) => {
    const logger = locals.logger;
    const pbClient = locals.pb;
    const loginPayload: UserLoginPayload = await request.json();
    logger.info('Authenticating user...', { username: loginPayload.username });

    const authenticatedData = await authenticateUser(loginPayload, pbClient, logger);
    if(authenticatedData && authenticatedData.id) {
        logger.info(`User: ${authenticatedData.username} authenticated success`, 
            { username: authenticatedData.username });
        
        const successRes: ApiResponse<{id: string, username: string}> = {
            success: true,
            data: { id: authenticatedData.id, username: authenticatedData.username! }
        };
        return json(successRes, { status: 200 });
    } else {
        logger.warning(
            `Authenticate user failed. Cannot find user info: ${loginPayload.username}`, 
                { username: loginPayload.username });
        
        const failedRes: ApiResponse<null> = {
            success: false,
            message: 'Invalid credentials',
            data: null
        };
        return json(failedRes, { status: 401 });
    }
}
