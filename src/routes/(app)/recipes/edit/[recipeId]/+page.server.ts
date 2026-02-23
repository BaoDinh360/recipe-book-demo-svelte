import type { PageServerLoad } from "./$types";
import { getRecipeByIdWithIngredients } from '$lib/server/recipe-service';
import { BusinessError } from "$lib/server/business-errors";
import { error } from "@sveltejs/kit";
import { handlePocketbaseError } from "$lib/server/error-handler";
import { ClientResponseError } from "pocketbase";
import { getAllIngredientsSelect } from "$lib/server/ingredient-service";

export const load: PageServerLoad = async ({ params, locals }) => {
    const logger = locals.logger;
    const pbClient = locals.pb;
    logger.info('Fetching recipe details', { recipeId: params.recipeId });
    const recipe = await getRecipeByIdWithIngredients(params.recipeId, pbClient, logger);
    logger.info('Recipe details data', 
        { recipeId: recipe.id, totalIngredients: recipe.ingredients.length});
    // get all ingredients for select
    const ingredientSelects = await getAllIngredientsSelect(pbClient, logger);

    return {
        recipeData: recipe,
        ingredientSelects,
    };
    // try {
    //     logger.info('Fetching recipe details', { recipeId: params.recipeId });
    //     const recipe = await getRecipeByIdWithIngredients(params.recipeId, pbClient, logger);
    //     logger.info('Recipe details data', 
    //         { recipeId: recipe.id, totalIngredients: recipe.ingredients.length});
    //     // get all ingredients for select
    //     const ingredientSelects = await getAllIngredientsSelect(pbClient, logger);

    //     return {
    //         recipeData: recipe,
    //         ingredientSelects,
    //     };
    // } catch (err) {
    //     let errorMsg: string | undefined;
    //     // business logic error
    //     if(err instanceof BusinessError) {
    //         errorMsg = err.message;
    //         // return error msg back to page
    //         return {
    //         recipeData: undefined,
    //         ingredientSelects: [],
    //         errorMsg,
    //     };
    //     } else if (err instanceof ClientResponseError) {
    //         handlePocketbaseError(err, logger);
    //     } else {
    //         // other error
    //         logger.error('Unhandled server error', {err});
    //     }
    //     // display error page for 500
    //     throw error(500, 'An unexpected server error occurred!');
    // }
}