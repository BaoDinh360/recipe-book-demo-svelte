import type { RecipeDetail } from '$lib/recipe-types';
import { notifyError } from '$lib/stores/notification-stores';
import { getRecipeById } from '$lib/utils/recipe-service';
import type { PageLoad } from './$types';

// export const load: PageLoad = async ({ params }) => {
//     let recipeDetailsData: RecipeDetail | undefined = undefined;
//     let notiMessage = '';
//     try {
//         const recipe = await getRecipeById(params.recipeId);
//         if(recipe) {
//             recipeDetailsData = recipe;
//         }
//         else {
//             console.log('Cannot find recipe with id: return null ', params.recipeId);
//             recipeDetailsData = undefined;
            
//             notiMessage = 'Cannot find recipe!';
//             notifyError(notiMessage);
//         }
//     } catch (error) {
//         console.log('An exception occurs: ', error);
//         recipeDetailsData = undefined;
        
//         notiMessage = 'An error occurs when load recipe data!';
//         notifyError(notiMessage);
//     }
//     return {
//         recipeDetailData: recipeDetailsData
//     };
// };