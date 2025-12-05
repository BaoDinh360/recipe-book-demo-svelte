import { BusinessError } from "$lib/server/business-errors";
import { getAllIngredients } from "$lib/server/ingredient-service";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { handlePocketbaseError } from "$lib/server/error-handler";
import { ClientResponseError } from "pocketbase";

export const load: PageServerLoad = async ({ locals }) => {
    const logger = locals.logger;
    try {
        logger.info('Fetching ingredients data');
        const ingredientSelects = await getAllIngredients(logger);
        logger.info('Ingredients data result', { totals: ingredientSelects.length });
        return {
            ingredientSelects
        }
    } catch (err) {
        let errorMsg: string | undefined;
        // business logic error
        if(err instanceof BusinessError) {
            errorMsg = err.message;
            // return error msg back to page
            return {
            ingredientSelects: [],
            errorMsg
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
}