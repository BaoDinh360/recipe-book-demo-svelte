// See https://svelte.dev/docs/kit/types#app.d.ts
import type { Logger } from "winston";
import PocketBase from 'pocketbase';
import type { UserData } from "$lib/types/user-authen-types";
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			logger: Logger;
			pb: PocketBase;
			user: UserData | undefined;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
