<script lang="ts">
    import { goto } from "$app/navigation";
	import RecipeForm from "$lib/components/RecipeForm.svelte";
	import type { CreateRecipeData } from "$lib/recipe-types";
	import { notifyError, notifySuccess } from "$lib/stores/notification-stores";
	import { createRecipe } from "$lib/utils/recipe-service";
	import { ClientResponseError } from "pocketbase";

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
            // pocketbase exception
            if(error instanceof ClientResponseError) {
                console.error('Pocketbase Api Exception: ', error);
                console.error('Pocketbase error response: ', error.response);
                if(error?.data?.data) {
                    const fieldErrors = [];
                    for(const [field, info] of Object.entries<any>(error.data.data)) {
                        fieldErrors.push(` - ${field}: ${info.message}`);
                    }
                    notiMessage = `Error creating recipe:${'\n'}${fieldErrors.join('\n')}`;
                }
            } else {
                // other exception
                console.error('An exception occurs: ', error);
                notiMessage = 'An error occurs when creating new recipe!';
            }
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