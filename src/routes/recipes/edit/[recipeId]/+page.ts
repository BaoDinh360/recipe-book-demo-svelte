import type { UpdateRecipeData } from '$lib/recipe-types';
import { fetchRecipeById } from '$lib/utils/recipe-service';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
    let recipeUpdateData: UpdateRecipeData | undefined;
    const recipe = await fetchRecipeById(params.recipeId);
    if(recipe === null) {
        console.log('Cannot find recipe with id: ', params.recipeId);
        recipeUpdateData = undefined;
    }
    else {
        // exclude unecessary props
        const { createdAt, ...included } = recipe;
        recipeUpdateData = included;
    }
    return {
        recipeData: recipeUpdateData
    };
};