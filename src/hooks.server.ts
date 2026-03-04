
import { AppError, ErrorCode } from "$lib/server/business-errors";
import { logger } from "$lib/server/logger";
import { createPocketbaseClient } from "$lib/server/pocketbase-client";
import { ResultFactory } from "$lib/types/result-types";
import type { Handle, HandleServerError } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";


// SvelteKit middleware, intercept before requests, responses

const handleRequestLogging: Handle = async({ event, resolve }) => {
    // correlation id
    const requestId = crypto.randomUUID();
    // add additional context data to every log in a scoped request
    const logMetadata = {
        requestId,
        path: event.url.pathname + event.url.search,
        method: event.request.method,
        clientIp: event.getClientAddress(),
    };
    event.locals.logger = logger.child(logMetadata);
    const reqStartDateTime = Date.now();
    // event.locals.logger.info('Incoming request');
    try {
        const response = await resolve(event);
        const status = response.status;
        const responseMetadata = {
            userId: event.locals.userInfo?.username,
            status,
            duration: `${Date.now() - reqStartDateTime} ms`,
            contentType: response.headers.get('content-type') || 'unknow'
        }
        // event.locals.logger.info(`Request completed! HTTP Status ${status}`, responseMetadata);
        event.locals.logger.info(`${event.request.method} ${event.url.pathname}`, responseMetadata);
        return response;
    } catch (err) {
        event.locals.logger.error('Unhandled error in middleware',{
            err,
            duration: `${Date.now() - reqStartDateTime} ms`
        });

        throw err;
    }
}

const handlePocketBaseRequest: Handle = async({ event, resolve }) => {
    // init new PB instance, set it to even locals
    event.locals.pb = createPocketbaseClient();
    // get current pb authStore state from cookie
    event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');
    try {
        if(event.locals.pb.authStore.isValid) {
            const pbAuthStoreRec = event.locals.pb.authStore.record;
            event.locals.userInfo = structuredClone(pbAuthStoreRec);
            const currUsername = event.locals.userInfo?.username;
            // add current username to logging ctx
            event.locals.logger = event.locals.logger.child({ userId: currUsername });
        } else {
            event.locals.userInfo = undefined;
        }
    } catch (err) {
        event.locals.pb.authStore.clear();
        event.locals.userInfo = undefined;
    }

    const response = await resolve(event);
    // set new pb authStore state to cookie
    response.headers.append('set-cookie', event.locals.pb.authStore.exportToCookie());

    return response;
}

// run hooks in order 
export const handle = sequence(
    handleRequestLogging,
    handlePocketBaseRequest
);

// global error handler
export const handleError: HandleServerError = ({ error, event }) => {
    const path = event.url.pathname;
    // display stack trace in dev only
    const isProdEnv = process.env.NODE_ENV === 'production';
    const stackTrace = !isProdEnv ? (error as any).stack : undefined;

    event.locals.logger.error(`Unexpected error occurs at ${path}: `, error);
    // handle AppError
    if (error instanceof AppError) {
        return ResultFactory.fail(
            error.message,
            error.code,
            error.status,
            stackTrace
        );
    }
    // handle Sveltekit built in error()
    if (typeof error === 'object' && error !== null && 'status' in error) {
        return ResultFactory.fail(
            (error as any).body?.message ?? 'Internal server error',
            ErrorCode.INTERNAL_ERROR,
            (error as any).status,
            stackTrace
        );
    }
    // fallback
    return ResultFactory.fail(
        'An unexpected internal server error occured.',
        ErrorCode.INTERNAL_ERROR,
        500,
        stackTrace
    );
}