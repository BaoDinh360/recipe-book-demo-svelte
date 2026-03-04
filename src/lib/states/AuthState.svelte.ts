
//UI - shared global state

import { type UserInfo } from "$lib/types/user-authen-types";

// using class
class AuthState {
    // private class state
    #currentUser = $state<UserInfo | null>(null);
    get currentUser() {
        return this.#currentUser;
    }
    set currentUser(value: UserInfo | null) {
        this.#currentUser = value;
    }

    get isLoggedIn() {
        return this.#currentUser !== null;
    }
}

export const authState = new AuthState(); 