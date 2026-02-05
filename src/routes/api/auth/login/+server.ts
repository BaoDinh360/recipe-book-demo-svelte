import { authenticateUser } from "$lib/server/auth-service"
import { AuthenticationError } from "$lib/server/business-errors";
import { handlePocketbaseError } from "$lib/server/error-handler";
import type { ApiResponse } from '$lib/types';
import { json } from '@sveltejs/kit'
import { ClientResponseError } from "pocketbase";

// POST /api/auth/login
export const POST = async({ request, url, locals }) => {
    const logger = locals.logger;
    const pbClient = locals.pb;
    try {
        const { username, password }: 
            { username: string, password: string } = await request.json();
        logger.info('Authenticating user...', { username });

        const authenticatedData = await authenticateUser(username, password, pbClient, logger);
        if(authenticatedData && authenticatedData.id) {
            logger.info(`User: ${username} authenticated success`, 
                { username: authenticatedData.username });
            
            const successRes: ApiResponse<{id: string, username: string}> = {
                success: true,
                data: { id: authenticatedData.id, username: authenticatedData.username! }
            };
            return json(successRes, { status: 200 });
        } else {
            logger.warning(`Authenticate user failed. Cannot find user info: ${username}`, { username });
            
            const failedRes: ApiResponse<null> = {
                success: false,
                message: 'Invalid credentials',
                data: null
            };
            return json(failedRes, { status: 401 });
        }
        
    } catch (err) {
        let status, message;
        if(err instanceof AuthenticationError) {
            status = 401;
            message = err.message;
        } else if (err instanceof ClientResponseError) {
            handlePocketbaseError(err, logger);
        }
        else {
            // other error
            logger.error('Unhandled server error', {err});
            status = 500;
            message = 'An unexpected server error occurred!';
        }
        const errRes: ApiResponse<null> = {
            success: false,
            message,
            data: null
        };
        return json(errRes, { status: status });
    }
}
