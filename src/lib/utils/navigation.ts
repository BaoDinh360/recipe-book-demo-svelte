import { goto } from "$app/navigation";
import { lastRecipeUrl } from "$lib/stores/navigation-state"
import { get } from "svelte/store"

// naviagte to /recipes, keeps query params
export const navigateToRecipes = async () => {
    const url = get(lastRecipeUrl);
    return goto(url ?? '/recipes');
}
export const navigateToMyRecipes = async () => {
    const url = get(lastRecipeUrl);
    return goto(url ?? '/my-recipes');
}
export const navigateToHomePage = async () => {
    return goto('/');
}
export const navigateToLogin = async (redirectTo?: string | null) => {
    const baseUrl = '/login';
    if (redirectTo) {
        return goto(`${baseUrl}?redirectTo=${redirectTo}`);
    }
    return goto(baseUrl);
}
export const navigateToRegister = async (redirectTo?: string | null) => {
    const baseUrl = '/register';
    if (redirectTo) {
        return goto(`${baseUrl}?redirectTo=${redirectTo}`);
    }
    return goto(baseUrl);
}

export const redirectToUrl = async (redirectTo?: string | null, defaultUrl: string = '/') => {
    if (!redirectTo) {
        return goto(defaultUrl);
    }
    if (!redirectTo?.startsWith('/') || redirectTo.startsWith('//')) {
        return goto(defaultUrl);
    }
    return goto(redirectTo);
}