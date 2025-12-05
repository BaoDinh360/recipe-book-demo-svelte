import { BusinessError } from '$lib/server/business-errors.js';
import { handlePocketbaseError } from '$lib/server/error-handler';
import { getAllIngredients } from '$lib/server/ingredient-service.js';
import type { ApiResponse } from '$lib/types.js';
import type { IngredientSelect } from '$lib/types/ingredient-types.js';
import { json } from '@sveltejs/kit';
import { ClientResponseError } from 'pocketbase';

export const GET = async({ request, url, locals }) => {
    const logger = locals.logger;
    try {
        logger.info('Fetching ingredients data');
        const ingredients = await getAllIngredients(logger);
        logger.info('Ingredients data result', { totals: ingredients.length });
        const successRes: ApiResponse<IngredientSelect[]> = {
            success: true,
            data: ingredients
        };
        return json(successRes, { status: 200 });
    } catch (err) {
        let status, message;
        if(err instanceof BusinessError) {
            status = err.statusCode;
            message = err.message;
        } else if (err instanceof ClientResponseError) {
            handlePocketbaseError(err, logger);
        } else {
            // other error
            logger.error('Unhandled server error', {err});
            status = 500;
            message = 'An unexpected server error occurred!';
        }
        const errRes: ApiResponse<null> = {
            success: false,
            message,
            data: null
        };
        return json(errRes, { status: status });
    }
}