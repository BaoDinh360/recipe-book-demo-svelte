import type { RecipeDetail } from '$lib/recipe-types';
import { fetchRecipeById } from '$lib/utils/recipe-service';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
    let recipeDetailsData: RecipeDetail | undefined;
    const recipe = await fetchRecipeById(params.recipeId);
    if(recipe === null) {
        console.log('Cannot find recipe with id: ', params.recipeId);
        recipeDetailsData = undefined;
    }
    else {
        recipeDetailsData = recipe;
    }
    return {
        recipeDetailData: recipeDetailsData
    };
};