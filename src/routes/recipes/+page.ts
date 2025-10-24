import type { RecipeListItem } from "$lib/recipe-types";
import { getPaginatedRecipeList } from "$lib/utils/recipe-service";
import type { PageLoad } from "./$types";

const RECIPES_TAG = 'app:recipes';

export const load: PageLoad = async ({ params, depends }) => {
    // depends tag used for invalidate --> trigger re fetch data
    depends(RECIPES_TAG);
    const recipeListData: RecipeListItem[] = await getPaginatedRecipeList();
    console.log('Total recipe data found: ', recipeListData.length);
    return {
        recipeListData: recipeListData
    };
};