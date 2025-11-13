import { BusinessError } from '$lib/server/business-errors.js';
import { getAllIngredients } from '$lib/server/ingredient-service.js';
import type { ApiResponse } from '$lib/types.js';
import type { IngredientSelect } from '$lib/types/ingredient-types.js';
import { json } from '@sveltejs/kit';

export const GET = async({ request, url }) => {
    console.log(`Api endpoint: ${request.method} - ${url.pathname}`);
    try {
        const ingredients = await getAllIngredients();
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
        } else {
            // other error
            console.error('Api endpoint unhandled exception error: ', err);
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