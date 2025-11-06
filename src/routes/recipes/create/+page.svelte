<script lang="ts">
	import RecipeForm from "$lib/components/RecipeForm.svelte";
	import type { CreateRecipeData } from "$lib/recipe-types";
	import { notifyError, notifySuccess } from "$lib/stores/notification-stores";
	import { navigateToRecipes } from "$lib/utils/navigation";

    // path: /recipes/create/

    const onCreateRecipe = async(recipeData: CreateRecipeData): Promise<void> => {
        let notiMessage = '';
        try {
            const response = await fetch('/api/recipes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(recipeData)
            });
            const result = await response.json();
            // success
            if(response.ok && result.success) {
                // back to index /recipes
                await navigateToRecipes();
                // show success noti
                notiMessage = `Create new recipe: ${result.data.recipeCode} success!`;
                notifySuccess(notiMessage);
            } else {
                // failed
                notiMessage = result.message ?? 'Failed to create new recipe!';
                notifyError(notiMessage);
            }
        } catch (err) {
            console.error('An exception occurs: ', err);
            notifyError('An unexpected error occurs!');
        }
    }
    const onCancel = async () => {
        // redirect to index /recipes 
        await navigateToRecipes();
    }

</script>

<RecipeForm 
    onSubmit={onCreateRecipe}
    {onCancel}/>

<style>

</style>