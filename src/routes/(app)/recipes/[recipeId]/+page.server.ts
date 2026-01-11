import type { RecipeDetail } from '$lib/recipe-types';
import { BusinessError } from '$lib/server/business-errors';
import { getRecipeById, getRecipeByIdWithIngredients } from '$lib/server/recipe-service';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { handlePocketbaseError } from '$lib/server/error-handler';
import { ClientResponseError } from 'pocketbase';

export const load: PageServerLoad = async ({ params, locals }) => {
    const logger = locals.logger;
    try {
        logger.info('Fetching recipe details', { recipeId: params.recipeId });
        const recipe = await getRecipeByIdWithIngredients(params.recipeId, logger);
        logger.info('Recipe details data', 
            { recipeId: recipe.id, totalIngredients: recipe.ingredients.length});
        return {
            recipeDetailData: recipe
        };
    } catch (err) {
        let errorMsg: string | undefined;
        // business logic error
        if(err instanceof BusinessError) {
            errorMsg = err.message;
            // return error msg back to page
            return {
            recipeDetailData: undefined,
            errorMsg,
        };
        } else if (err instanceof ClientResponseError) {
            handlePocketbaseError(err, logger);
        } else {
            // other error
            logger.error('Unhandled server error', {err});
        }
        // display error page for 500
        throw error(500, 'An unexpected server error occurred!');
    }
};