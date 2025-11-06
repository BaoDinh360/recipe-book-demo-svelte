import type { UpdateRecipeData } from '$lib/recipe-types';
import { BusinessError } from '$lib/server/business-errors';
import { deleteRecipe, updateRecipe } from '$lib/server/recipe-service';
import { json } from '@sveltejs/kit';

// api endpoint: PUT /api/recipes/[id]
export const PUT = async({ request, url }) => {
    console.log(`Api endpoint: ${request.method} - ${url.pathname}`);
    try {
        const recipeData: UpdateRecipeData = await request.json();
        const updated = await updateRecipe(recipeData);
        return json({
            success: true,
            code: 200,
            data: { id: updated.id, recipeCode: updated.recipeCode },
        }, { status: 200 });
    } catch (err) {
        let status, message;
        if(err instanceof BusinessError) {
            status = err.statusCode;
            message = err.message;
        } else {
            // other error
            console.error('Api endpoint unhandled exception error: ', err);
            status = 500;
            message = 'An unexpected server error occurred!';
        }
        return json({
            success: false,
            code: status,
            message: message,
        }, { status: status });
    }
}

// api endpoint: DELETE /api/recipes/[id]
export const DELETE = async({ request, url, params }) => {
    console.log(`Api endpoint: ${request.method} - ${url.pathname}`);
    try {
        const recipeId = params.id;
        await deleteRecipe(recipeId);
        return json({
            success: true,
            code: 200
        }, { status: 200 });
    } catch (err) {
        let status, message;
        if(err instanceof BusinessError) {
            status = err.statusCode;
            message = err.message;
        } else {
            // other error
            console.error('Api endpoint unhandled exception error: ', err);
            status = 500;
            message = 'An unexpected server error occurred!';
        }
        return json({
            success: false,
            code: status,
            message: message,
        }, { status: status });
    }
}