import { goto } from "$app/navigation";
import { lastRecipeUrl } from "$lib/stores/navigation-state"
import { get } from "svelte/store"

// naviagte to /recipes, keeps query params
export const navigateToRecipes = async () => {
    const url = get(lastRecipeUrl);
    return await goto(url ?? '/recipes');
}