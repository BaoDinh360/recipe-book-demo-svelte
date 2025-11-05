import type { RecipeDetail } from '$lib/recipe-types';
import { BusinessError } from '$lib/server/business-errors';
import { getRecipeById } from '$lib/server/recipe-service';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    try {
        const recipe = await getRecipeById(params.recipeId);
        return {
            recipeDetailData: recipe
        };
    } catch (err) {
        let errorMsg: string | undefined;
        // business logic error
        if(err instanceof BusinessError) {
            errorMsg = err.message;
            // return error msg back to page
        } else {
            // other error
            // display error page for 500
            console.error('Unhandled exception error: ', err);
            throw error(500, 'An unexpected server error occurred!');
        }
        return {
            recipeDetailData: undefined,
            errorMsg,
        };
    }
};