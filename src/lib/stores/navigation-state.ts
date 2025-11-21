import { writable } from "svelte/store";
export const lastRecipeUrl = writable<string | null>(null);