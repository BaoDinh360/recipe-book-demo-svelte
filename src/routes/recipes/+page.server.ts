import type { RecipeCategory, RecipeFilterCriteria } from '$lib/recipe-types';
import { BusinessError } from '$lib/server/business-errors';
import { getPaginatedRecipeList } from '$lib/server/recipe-service';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

const RECIPES_TAG = 'app:recipes';
const DEFAULT_START_PAGE = 1;
const DEFAULT_PER_PAGE = 3; // 3, 6, 9

// url with query params: /recipes?page=...&perPage=...
// for each filter params, put it as separate query params, e.g: &category=...
// filter by:
// - text search: text=...
// - category: &category=...
// - prepTimeMin: &prepTimeMin=... (<= )
// sort: sort=

// runs on server only
export const load: PageServerLoad = async ({ url, depends }) => {
    // pagination
        const currentPage = Number(url.searchParams.get('page') || DEFAULT_START_PAGE);
        const itemsPerPage = Number(url.searchParams.get('perPage') || DEFAULT_PER_PAGE);
        // filter
        const recipeFilters: RecipeFilterCriteria = {
            text: url.searchParams.get('text') || undefined,
            category: url.searchParams.get('category') as RecipeCategory || undefined,
            prepTimeMin: url.searchParams.get('prepTimeMin') !== null ? Number(url.searchParams.get('prepTimeMin'))
                : undefined,
            sortBy: url.searchParams.get('sort') || '-created'
        }
        try {
             // depends tag used for invalidate --> trigger re fetch data
            depends(RECIPES_TAG);
    
            const paginatedResult = await getPaginatedRecipeList(currentPage, itemsPerPage, recipeFilters);
            const { totalPages, totalItems, items } = paginatedResult;
            console.log('paginated recipe: ', { currentPage, itemsPerPage, totalPages, totalItems, itemsCount: items.length });

            return {
                recipeListData: items,
                currentPage,
                itemsPerPage,
                totalPages,
                totalItems,
                recipeFilters
            }
    
        } catch (err) {
            let errorMsg: string | undefined;
            // business logic error
            if(err instanceof BusinessError) {
                errorMsg = err.message;
                // return error msg back to page
            } else {
                // other error
                // display error page for 500
                console.error('Unhandled exception error: ', err);
                throw error(500, 'An unexpected server error occurred!');
            }
            return {
                recipeListData: [],
                currentPage,
                itemsPerPage,
                totalPages: 0,
                totalItems: 0,
                errorMsg,
            };        
        }
}