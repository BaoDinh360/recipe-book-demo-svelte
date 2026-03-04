import type { UserRegisterPayload } from "$lib/types/user-authen-types";
import { ResultFactory } from "$lib/types/result-types.js";
import { json } from "@sveltejs/kit";
import { addUser } from "$lib/server/auth-service.js";

// POST /api/auth/register
export const POST = async({ request, url, locals }) => {
    const logger = locals.logger;
    const pbClient = locals.pb;
    const registerPayload: UserRegisterPayload = await request.json();
    logger.info('Register new user...', { username: registerPayload.username });

    const registerData = await addUser(registerPayload, pbClient, logger);
    logger.info(`New User: ${registerData.username} is registered success`, 
            { username: registerData.username });
    
    const data = {
        id: registerData.id,
        username: registerData.username
    };
    const successRes = ResultFactory.success(data);
    return json(successRes, { status: 200 });
}