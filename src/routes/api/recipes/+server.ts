import type { CreateRecipeData } from '$lib/recipe-types';
import { BusinessError } from '$lib/server/business-errors';
import { createRecipeWithIngredients } from '$lib/server/recipe-service.js';
import { json, error } from '@sveltejs/kit'
// api endpoint: /api/recipes/

// POST
export const POST = async({ request, url }) => {
    console.log(`Api endpoint: ${request.method} - ${url.pathname}`);
    try {
        const recipeData: CreateRecipeData = await request.json();
        console.log('Request payload: ', JSON.stringify(recipeData));
        //const created = await createRecipe(recipeData);
        const created = await createRecipeWithIngredients(recipeData);
        
        return json({
            success: true,
            code: 201,
            data: created,
        }, { status: 201 });
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