import { getAllIngredientsSelect } from '$lib/server/ingredient-service.js';
import type { IngredientSelect } from '$lib/types/ingredient-types.js';
import { ResultFactory, type Result } from '$lib/types/result-types.js';
import { json } from '@sveltejs/kit';

export const GET = async({ request, url, locals }) => {
    const logger = locals.logger;
    const pbClient = locals.pb;
    logger.info('Fetching ingredients data');
    const ingredients = await getAllIngredientsSelect(pbClient, logger);
    logger.info('Ingredients data result', { totals: ingredients.length });
    const successRes: Result<IngredientSelect[]> = ResultFactory.success(ingredients);
    return json(successRes, { status: 200 });
}