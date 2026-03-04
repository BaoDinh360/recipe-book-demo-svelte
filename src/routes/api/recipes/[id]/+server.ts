import { deleteRecipe, updateRecipe } from '$lib/server/recipe-service';
import type { UpdateRecipePayload } from '$lib/types/recipe-types.js';
import { ResultFactory, type Result } from '$lib/types/result-types.js';
import { json } from '@sveltejs/kit';

// api endpoint: PUT /api/recipes/[id]
export const PUT = async({ request, url, locals }) => {
    const logger = locals.logger;
    const pbClient = locals.pb;
    const recipePayload: UpdateRecipePayload = await request.json();
    logger.info('Updating recipe', { recipeId: recipePayload.id });
    const updated = await updateRecipe(recipePayload, pbClient, logger);
    logger.info('Recipe updated', { recipeId: updated.id, recipeCode: updated.recipeCode });
    const successRes: Result<{id: string, recipeCode: string}> = ResultFactory.success(updated);
    return json(successRes, { status: 200 });
    // try {
    //     const recipePayload: UpdateRecipePayload = await request.json();
    //     logger.info('Updating recipe', { recipeId: recipePayload.id });
    //     const updated = await updateRecipe(recipePayload, pbClient, logger);
    //     logger.info('Recipe updated', { recipeId: updated.id, recipeCode: updated.recipeCode });
    //     const successRes: ApiResponse<{id: string, recipeCode: string}> = {
    //         success: true,
    //         data: updated
    //     };
    //     return json(successRes, { status: 200 });
    // } catch (err) {
    //     let status, message;
    //     if(err instanceof BusinessError) {
    //         status = err.statusCode;
    //         message = err.message;
    //     } else if (err instanceof ClientResponseError) {
    //         handlePocketbaseError(err, logger);
    //     }
    //     else {
    //         // other error
    //         logger.error('Unhandled server error', {err}, );
    //         status = 500;
    //         message = 'An unexpected server error occurred!';
    //     }
    //     const errRes: ApiResponse<null> = {
    //         success: false,
    //         message,
    //         data: null
    //     };
    //     return json(errRes, { status: status });
    // }
}

// api endpoint: DELETE /api/recipes/[id]
export const DELETE = async({ request, url, params, locals }) => {
    const logger = locals.logger;
    const pbClient = locals.pb;
    const recipeId = params.id;
    logger.info('Deleting recipe', { recipeId  });

    await deleteRecipe(recipeId, pbClient, logger);
    
    logger.info('Recipe deleted', { recipeId  });
    const successRes: Result = ResultFactory.success();
    return json(successRes, { status: 200 });
    // try {
    //     const recipeId = params.id;
    //     logger.info('Deleting recipe', { recipeId  });
    //     await deleteRecipe(recipeId, pbClient, logger);
    //     logger.info('Recipe deleted', { recipeId  });
    //     const successRes: ApiResponse<null> = {
    //         success: true
    //     };
    //     return json(successRes, { status: 200 });
    // } catch (err) {
    //     let status, message;
    //     if(err instanceof BusinessError) {
    //         status = err.statusCode;
    //         message = err.message;
    //     } else if (err instanceof ClientResponseError) {
    //         handlePocketbaseError(err, logger);
    //     }
    //     else {
    //         // other error
    //         logger.error('Unhandled server error', {err});
    //         status = 500;
    //         message = 'An unexpected server error occurred!';
    //     }
    //     const errRes: ApiResponse<null> = {
    //         success: false,
    //         message,
    //         data: null
    //     };
    //     return json(errRes, { status: status });
    // }
}