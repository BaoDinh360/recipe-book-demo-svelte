import { authenticateUser } from "$lib/server/auth-service"
import { ResultFactory, type Result } from "$lib/types/result-types.js";
import type { UserLoginPayload } from "$lib/types/user-authen-types.js";
import { json } from '@sveltejs/kit'

// POST /api/auth/login
export const POST = async({ request, url, locals }) => {
    const logger = locals.logger;
    const pbClient = locals.pb;
    const loginPayload: UserLoginPayload = await request.json();

    const authenticatedData = await authenticateUser(loginPayload, pbClient, logger);
    // update locals.userInfo new data
    locals.userInfo = structuredClone(authenticatedData);
    logger.info(`Successfully authenticated user: ${locals.userInfo.username}`);
    console.log('url: ', url.searchParams);
    const successRes = ResultFactory.success();
    return json(successRes, { status: 200 });

    // if(authenticatedData && authenticatedData.id) {
    //     logger.info(`User: ${authenticatedData.username} authenticated success`, 
    //         { username: authenticatedData.username });
        
    //     const successRes: ApiResponse<{id: string, username: string}> = {
    //         success: true,
    //         data: { id: authenticatedData.id, username: authenticatedData.username! }
    //     };
    //     return json(successRes, { status: 200 });
    // } else {
    //     logger.warning(
    //         `Authenticate user failed. Cannot find user info: ${loginPayload.username}`, 
    //             { username: loginPayload.username });
        
    //     const failedRes: ApiResponse<null> = {
    //         success: false,
    //         message: 'Invalid credentials',
    //         data: null
    //     };
    //     return json(failedRes, { status: 401 });
    // }
}
