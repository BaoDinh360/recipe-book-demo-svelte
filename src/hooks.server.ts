import { logger } from "$lib/server/logger";
import type { Handle } from "@sveltejs/kit";

// SvelteKit middleware, intercept before requests, responses

export const handle: Handle = async({ event, resolve }) => {
    // correlation id
    const requestId = crypto.randomUUID();
    // add additional context data to every log in a scoped request
    const logMetadata = {
        requestId,
        path: event.url.pathname + event.url.search,
        method: event.request.method,
        clientIp: event.getClientAddress() 
    };
    event.locals.logger = logger.child(logMetadata);
    const reqStartDateTime = Date.now();
    event.locals.logger.info('Incoming request');
    try {
        const response = await resolve(event);
        const status = response.status;
        const responseMetadata = {
            status,
            duration: `${Date.now() - reqStartDateTime} ms`,
            contentType: response.headers.get('content-type') || 'unknow'
        }
        event.locals.logger.info(`Request completed! HTTP Status ${status}`, responseMetadata);
        return response;
    } catch (err) {
        event.locals.logger.error('Unhandled error in middleware',{
            err,
            duration: `${Date.now() - reqStartDateTime} ms`
        });

        throw err;
    }
}