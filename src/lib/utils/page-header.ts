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
// // recipes route
// export const recipeRoutePageTypeMap: Record<string, PageType> = {
//     // recipe route, page type
//     '/recipes': PageType.INDEX,
//     '/recipes/[recipeId]': PageType.DETAIL,
//     '/recipes/create': PageType.CREATE,
//     '/recipes/edit/[recipeId]': PageType.EDIT
// };
// export const pageTypeRecipeTitleMap: Record<PageType, string> = {
//     // recipe route, title
//     [PageType.INDEX]: 'Recipes List',
//     [PageType.DETAIL]: 'Recipe Details',
//     [PageType.CREATE]: 'Add Recipe',
//     [PageType.EDIT]: 'Edit Recipe',
//     [PageType.DEFAULT]: '',
// };
// export const getRecipePageTypeByRoute = (pageRoute: string | null) => {
//     if(pageRoute) {
//         return recipeRoutePageTypeMap[pageRoute] || PageType.DEFAULT;
//     }
//     return PageType.DEFAULT;
// }
// export const getRecipesPageTitleByPageType = (pageType: PageType) => {
//     return pageTypeRecipeTitleMap[pageType] || '';
// };
