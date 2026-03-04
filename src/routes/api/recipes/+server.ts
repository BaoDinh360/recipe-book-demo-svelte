
import { createRecipeWithIngredients } from '$lib/server/recipe-service.js';
import type { CreateRecipePayload } from '$lib/types/recipe-types.js';
import { ResultFactory, type ResultSuccess } from '$lib/types/result-types.js';
import { json } from '@sveltejs/kit'

// POST /api/recipes/
export const POST = async({ request, url, locals }) => {
    const logger = locals.logger;
    const pbClient = locals.pb;
    const recipePayload: CreateRecipePayload = await request.json();
    logger.info('Creating new recipe', 
        { title: recipePayload.title, category: recipePayload.category, 
            totalIngredients: recipePayload.ingredients.length });
    const created = await createRecipeWithIngredients(recipePayload, pbClient, logger);
    logger.info('Recipe created', { recipeId: created.id, recipeCode: created.recipeCode });
    const successRes: ResultSuccess<{id: string, recipeCode: string}> = ResultFactory.success(created);
    return json(successRes, { status: 201 });
    // try {
    //     const recipePayload: CreateRecipePayload = await request.json();
    //     logger.info('Creating new recipe', 
    //         { title: recipePayload.title, category: recipePayload.category, 
    //             totalIngredients: recipePayload.ingredients.length });
    //     const created = await createRecipeWithIngredients(recipePayload, pbClient, logger);
    //     logger.info('Recipe created', { recipeId: created.id, recipeCode: created.recipeCode });
    //     const successRes: ApiResponse<{id: string, recipeCode: string}> = {
    //         success: true,
    //         data: created
    //     };
    //     return json(successRes, { status: 201 });
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
    //         logger.error('Unhandled server error: ', err);
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