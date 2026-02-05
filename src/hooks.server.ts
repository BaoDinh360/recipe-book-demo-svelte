import { env } from "$env/dynamic/private";
import { logger } from "$lib/server/logger";
import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import PocketBase from 'pocketbase';

const pocketbaseHost = env.POCKETBASE_HOST;

// SvelteKit middleware, intercept before requests, responses

const handleRequestLogging: Handle = async({ event, resolve }) => {
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

const handlePocketBaseAuthen: Handle = async({ event, resolve }) => {
    // init new PB instance, set it to even locals
    event.locals.pb = new PocketBase(pocketbaseHost);
    // get current pb authStore state from cookie
    event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

    if(event.locals.pb.authStore.isValid) {
        const authStoreRecord = event.locals.pb.authStore.record;
        // mapping to current user state
        event.locals.user = {
            id: authStoreRecord?.id,
            email: authStoreRecord?.email,
            username: authStoreRecord?.username,
            name: authStoreRecord?.name,
            created: new Date(authStoreRecord?.created)   
        }
    } else {
        event.locals.user = undefined;
    }

    event.locals.logger.info('pb authStore state: ', event.locals.pb.authStore);
    event.locals.logger.info('logged in user: ', event.locals.user);
    const response = await resolve(event);
    // set new pb authStore state to cookie
    response.headers.append('set-cookie', event.locals.pb.authStore.exportToCookie());

    return response;
}

// run hooks in order 
export const handle = sequence(
    handleRequestLogging,
    handlePocketBaseAuthen
);