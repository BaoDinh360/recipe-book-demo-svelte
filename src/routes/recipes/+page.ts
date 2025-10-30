import type { RecipeFilterCriteria, RecipeListItem } from "$lib/recipe-types";
import { notifyError } from "$lib/stores/notification-stores";
import type { RecipeCategory } from "$lib/types";
import { getPaginatedRecipeList } from "$lib/utils/recipe-service";
import type { PageLoad } from "./$types";

const RECIPES_TAG = 'app:recipes';
const DEFAULT_START_PAGE = 1;
const DEFAULT_PER_PAGE = 3; // 3, 6, 9

// url with query params: /recipes?page=...&perPage=...
// for each filter params, put it as separate query params, e.g: &category=...
// filter by:
// - text search: text=...
// - category: &category=...
// - prepTimeMin: &prepTimeMin=... (<= )
// sort: impl later

export const load: PageLoad = async ({ url, depends }) => {
    // pagination
    const currentPage = Number(url.searchParams.get('page') || DEFAULT_START_PAGE);
    const itemsPerPage = Number(url.searchParams.get('perPage') || DEFAULT_PER_PAGE);
    // filter
    const recipeFilters: RecipeFilterCriteria = {
        text: url.searchParams.get('text') || undefined,
        category: url.searchParams.get('category') as RecipeCategory || undefined,
        prepTimeMin: url.searchParams.get('prepTimeMin') !== null ? Number(url.searchParams.get('prepTimeMin'))
            : undefined,
        sortBy: url.searchParams.get('sort') || undefined
    }

    let notiMessage = '';
    try {
         // depends tag used for invalidate --> trigger re fetch data
        depends(RECIPES_TAG);

        const paginatedResult = await getPaginatedRecipeList(currentPage, itemsPerPage, recipeFilters);
        if(paginatedResult) {
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
        }
        // undefined return
        return {
            recipeListData: [],
            currentPage,
            itemsPerPage,
            totalPages: 0,
            totalItems: 0,
        };

    } catch (error) {
        console.log('An exception occurs: ', error);
        notiMessage = 'An error occurs when load recipe data!';
        notifyError(notiMessage);

        return {
            recipeListData: [],
            currentPage,
            itemsPerPage,
            totalPages: 0,
            totalItems: 0
        };        
    }
};