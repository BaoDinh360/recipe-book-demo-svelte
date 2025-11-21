import { PageType } from "$lib/types";

// route - title map
export const routePageTitleMap: Record<string, string> = {
    // home (index)
    '/': 'Home',
    '/recipes': 'Recipes',
    '/recipes/[recipeId]': 'Recipe Details',
    '/recipes/create': 'Create Recipe',
    '/recipes/edit/[recipeId]': 'Edit Recipe'
};
// hide back button for these page route
export const hideBackButtonRoute: string[] = [
    '/', '/recipes'
];
export const getPageTitleByRoute = (pageRoute: string | null) => {
    if(pageRoute) {
        return routePageTitleMap[pageRoute] || '';
    }
    return '';
};
export const isShowBackButton = (pageRoute: string | null) => {
    if(pageRoute) {
        return !hideBackButtonRoute.includes(pageRoute);
    }
    // fallback, hide
    return false;
}
