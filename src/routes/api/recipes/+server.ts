import type { CreateRecipeData } from '$lib/recipe-types';
import { BusinessError } from '$lib/server/business-errors';
import { createRecipeIngredients } from '$lib/server/recipe-ingred-service.js';
import { createRecipe } from '$lib/server/recipe-service.js';
import { json, error } from '@sveltejs/kit'
// api endpoint: /api/recipes/

// POST
export const POST = async({ request, url }) => {
    console.log(`Api endpoint: ${request.method} - ${url.pathname}`);
    try {
        const recipeData: CreateRecipeData = await request.json();
        console.log('Request payload: ', JSON.stringify(recipeData));
        const created = await createRecipe(recipeData);

        // add to recipe_ingredients if create recipe success
        let insertedList = [];
        if(created && created.id) {
            for(const item of recipeData.ingredients) {
                const result = await createRecipeIngredients(item, created.id);
                // if insert success, push to list
                insertedList.push(result);
            }
        }

        console.log('recipes ingredients inserted: ', insertedList);

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