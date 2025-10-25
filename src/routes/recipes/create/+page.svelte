<script lang="ts">
    import { goto } from "$app/navigation";
	import RecipeForm from "$lib/components/RecipeForm.svelte";
	import type { CreateRecipeData } from "$lib/recipe-types";
	import { notifyError, notifySuccess } from "$lib/stores/notification-stores";
	import { createRecipe } from "$lib/utils/recipe-service";

    // path: /recipes/create/

    const onCreateRecipe = async(recipeData: CreateRecipeData): Promise<void> => {
        let notiMessage = '';
        try {
            // create recipe
            const created = await createRecipe(recipeData);
            if(created !== null) {
                // go back to index /recipes page
                await goto('/recipes');
                // show success noti
                notiMessage = `Create new recipe: ${created.recipeCode} success!`;
                notifySuccess(notiMessage);
            }
            else {
                notiMessage = 'Failed to create new recipe!';
                notifyError(notiMessage);
            }
        } catch (error) {
            console.error('An exception occurs: ', error);
            notiMessage = 'An error occurs when creating new recipe!';
            notifyError(notiMessage);
        }
    }
    const onCancel = () => {
        // redirect to index /recipes 
        goto('/recipes');
    }

</script>

<RecipeForm 
    onSubmit={onCreateRecipe}
    {onCancel}/>

<style>

</style>