import type { UpdateRecipeData } from '$lib/recipe-types';
import { BusinessError } from '$lib/server/business-errors';
import { handlePocketbaseError } from '$lib/server/error-handler';
import { deleteRecipe, updateRecipe } from '$lib/server/recipe-service';
import type { ApiResponse } from '$lib/types.js';
import { json } from '@sveltejs/kit';
import { ClientResponseError } from 'pocketbase';

// api endpoint: PUT /api/recipes/[id]
export const PUT = async({ request, url, locals }) => {
    const logger = locals.logger;
    try {
        const recipeData: UpdateRecipeData = await request.json();
        logger.info('Updating recipe', { recipeId: recipeData.id, recipeCode: recipeData.recipeCode  });
        const updated = await updateRecipe(recipeData, logger);
        logger.info('Recipe updated', { recipeId: updated.id, recipeCode: updated.recipeCode });
        const successRes: ApiResponse<{id: string, recipeCode: string}> = {
            success: true,
            data: updated
        };
        return json(successRes, { status: 200 });
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
            logger.error('Unhandled server error', {err}, );
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

// api endpoint: DELETE /api/recipes/[id]
export const DELETE = async({ request, url, params, locals }) => {
    const logger = locals.logger;
    try {
        const recipeId = params.id;
        logger.info('Deleting recipe', { recipeId  });
        await deleteRecipe(recipeId, logger);
        logger.info('Recipe deleted', { recipeId  });
        const successRes: ApiResponse<null> = {
            success: true
        };
        return json(successRes, { status: 200 });
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