import type { PageServerLoad } from "./$types";
import { getRecipeById } from '$lib/server/recipe-service';
import { BusinessError } from "$lib/server/business-errors";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params }) => {
    try {
        const recipe = await getRecipeById(params.recipeId);
        // exclude unecessary props
        const { createdAt, lastUpdatedAt, ...included } = recipe;
        return {
            recipeData: included
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
            recipeData: undefined,
            errorMsg,
        };
    }
}