import type { UpdateRecipeData } from '$lib/recipe-types';
import { notifyError } from '$lib/stores/notification-stores';
import { getRecipeById } from '$lib/utils/recipe-service';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
    let recipeUpdateData: UpdateRecipeData | undefined;
    let notiMessage = '';
    try {
        const recipe = await getRecipeById(params.recipeId);
        if(recipe) {
            // exclude unecessary props
            const { createdAt, ...included } = recipe;
            recipeUpdateData = included;
            
        }
        else {
            console.log('Cannot find recipe with id: return null ', params.recipeId);
            recipeUpdateData = undefined;
            
            notiMessage = 'Cannot find recipe!';
            notifyError(notiMessage);  
        }
    } catch (error) {
        console.log('An exception occurs: ', error);
        recipeUpdateData = undefined;
        
        notiMessage = 'An error occurs when load recipe data!';
        notifyError(notiMessage);
    }
    
    return {
        recipeData: recipeUpdateData
    };
};