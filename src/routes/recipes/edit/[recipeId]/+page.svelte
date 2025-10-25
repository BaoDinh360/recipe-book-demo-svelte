<script lang="ts">
	import { goto } from "$app/navigation";
	import RecipeForm from "$lib/components/RecipeForm.svelte";
	import type { UpdateRecipeData } from "$lib/recipe-types";
	import { notifyError, notifySuccess } from "$lib/stores/notification-stores";
	import { updateRecipe } from "$lib/utils/recipe-service";
	import type { PageProps } from "./$types";

    // path: /recipes/edit/{id}

    let { data }: PageProps = $props();

    const onUpdateRecipe = async (recipeData: UpdateRecipeData) : Promise<void> => {
        let notiMessage = '';
        try {
            const updated = await updateRecipe(recipeData);
            if(updated !== null) {
                // go back to index /recipes page
                await goto('/recipes');
                // show success noti
                notiMessage = `Update recipe: ${recipeData.recipeCode} success!`;
                notifySuccess(notiMessage);
            }
            else {
                console.log('Update recipe {id} failed, return null', recipeData.id);
                notiMessage = `Failed to update recipe: ${recipeData.recipeCode}!`;
                notifyError(notiMessage);
            }
        } catch (error) {
            console.error('An exception occurs: ', error);
            notiMessage = `An error occurs when update recipe ${recipeData.recipeCode}!`;
            notifyError(notiMessage);
        }
    };
    const onCancel = () => {
        // redirect to index /recipes 
        goto('/recipes');
    }

</script>

<RecipeForm 
    recipeToEdit={data.recipeData}
    onSubmit={(recipeData) => onUpdateRecipe(recipeData as UpdateRecipeData)}
    {onCancel}
    />

<style>

</style>