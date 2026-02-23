import type { UsersResponse } from "./pocketbase-types";

// base user domain type
export type UserBase = UsersResponse;

export type UserInfo = Pick<UserBase, 'id' | 'email' | 'name' | 'username'>;

// user login payload
export type UserLoginPayload = Pick<UserBase, 'username'> & 
    { password: string };
// user registration payload
export type UserRegistrationPayload = Pick<UserBase, 'email' | 'name' | 'username' | 'password'> & 
    { passwordConfirm: string };