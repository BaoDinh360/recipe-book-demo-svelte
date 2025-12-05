import type { CreateRecipeData } from '$lib/recipe-types';
import { BusinessError } from '$lib/server/business-errors';
import { handlePocketbaseError } from '$lib/server/error-handler';
import { createRecipeWithIngredients } from '$lib/server/recipe-service.js';
import type { ApiResponse } from '$lib/types';
import { json, error } from '@sveltejs/kit'
import { ClientResponseError } from 'pocketbase';

// POST /api/recipes/
export const POST = async({ request, url, locals }) => {
    const logger = locals.logger;
    try {
        const recipeData: CreateRecipeData = await request.json();
        logger.info('Creating new recipe', 
            { title: recipeData.title, category: recipeData.category, 
                totalIngredients: recipeData.ingredients.length });
        const created = await createRecipeWithIngredients(recipeData, logger);
        logger.info('Recipe created', { recipeId: created.id, recipeCode: created.recipeCode });
        const successRes: ApiResponse<{id: string, recipeCode: string}> = {
            success: true,
            data: created
        };
        return json(successRes, { status: 201 });
    } catch (err) {
        let status, message;
        if(err instanceof BusinessError) {
            status = err.statusCode;
            message = err.message;
        } else if (err instanceof ClientResponseError) {
            handlePocketbaseError(err, logger);
        }
        else {
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