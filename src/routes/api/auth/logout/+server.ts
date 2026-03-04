import { PB_COOKIE_KEY } from "$lib/server/pocketbase-client";
import { ResultFactory } from "$lib/types/result-types.js";
import { json } from "@sveltejs/kit";

// api/auth/logout
export const POST = async ({ locals, cookies }) => {
    const logger = locals.logger;
    // clear Pocketbase authStore
    locals.pb.authStore.clear();
    locals.userInfo = undefined;
    // delete cookies
    cookies.delete(PB_COOKIE_KEY, { path: '/' });
    const successRes = ResultFactory.success();
    return json(successRes, { status: 200 });
}