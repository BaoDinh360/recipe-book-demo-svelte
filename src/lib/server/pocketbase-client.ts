import PocketBase from 'pocketbase';
import { env } from "$env/dynamic/private";
import type { TypedPocketBase } from "$lib/types/pocketbase-types";

const pocketbaseHost = env.POCKETBASE_HOST;
// default pocketbase cookie key name
export const PB_COOKIE_KEY = 'pb_auth';
// export const pbClient: TypedPocketBase = new PocketBase(pocketbaseHost);

export const createPocketbaseClient = () => {
    return new PocketBase(pocketbaseHost);
}

export function genPocketbaseId(length = 15): string {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const randomValues = new Uint8Array(length);
    crypto.getRandomValues(randomValues);
    for (let i = 0; i < length; i++) {
        result += alphabet[randomValues[i] % alphabet.length];
    }
    return result;
}