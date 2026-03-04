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
export const navigateToLogin = async () => {
    return goto('/login');
}
export const navigateToRegister = async () => {
    return goto('/register');
}