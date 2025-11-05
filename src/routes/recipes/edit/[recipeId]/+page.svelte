<script lang="ts">
	import { goto } from "$app/navigation";
	import RecipeForm from "$lib/components/RecipeForm.svelte";
	import type { UpdateRecipeData } from "$lib/recipe-types";
	import { notifyError, notifySuccess } from "$lib/stores/notification-stores";
	import { updateRecipe } from "$lib/utils/recipe-service";
	import { ClientResponseError } from "pocketbase";
	import type { PageProps } from "./$types";
	import { navigateToRecipes } from "$lib/utils/navigation";

    // path: /recipes/edit/{id}

    let { data }: PageProps = $props();

    $effect(() => {
        // display error noti if error
        if(data.errorMsg) {
            notifyError(data.errorMsg);
        }
    })

    const onUpdateRecipe = async (recipeData: UpdateRecipeData) : Promise<void> => {
        // let notiMessage = '';
        // try {
        //     const updated = await updateRecipe(recipeData);
        //     if(updated !== null) {
        //         // go back to index /recipes page
        //         await goto('/recipes');
        //         // show success noti
        //         notiMessage = `Update recipe: ${recipeData.recipeCode} success!`;
        //         notifySuccess(notiMessage);
        //     }
        //     else {
        //         console.log('Update recipe {id} failed, return null', recipeData.id);
        //         notiMessage = `Failed to update recipe: ${recipeData.recipeCode}!`;
        //         notifyError(notiMessage);
        //     }
        // } catch (error) {
        //     // pocketbase exception
        //     if(error instanceof ClientResponseError) {
        //         console.error('Pocketbase Api Exception: ', error);
        //         console.error('Pocketbase error response: ', error.response);
        //         if(error?.data?.data) {
        //             const fieldErrors = [];
        //             for(const [field, info] of Object.entries<any>(error.data.data)) {
        //                 fieldErrors.push(` - ${field}: ${info.message}`);
        //             }
        //             notiMessage = `Error updating recipe:${'\n'}${fieldErrors.join('\n')}`;
        //         }
        //     } else {
        //         // other exception
        //         console.error('An exception occurs: ', error);
        //         notiMessage = `An error occurs when updating recipe ${recipeData.recipeCode}!`;
        //     }
        //     notifyError(notiMessage);
        // }

        let notiMessage = '';
        let recipeId = recipeData.id;
        try {
            const response = await fetch(`/api/recipes/${recipeId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(recipeData)
            });
            const result = await response.json();
            // success
            if(response.ok && result.success) {
                // back to index /recipes
                await navigateToRecipes();
                // show success noti
                notiMessage = `Update recipe: ${result.data.recipeCode} success!`;
                notifySuccess(notiMessage);
            } else {
                // failed
                notiMessage = result.message ?? `Failed to update recipe: ${recipeData.recipeCode}!`;
                notifyError(notiMessage);
            }
        } catch (err) {
            console.error('An exception occurs: ', err);
            notifyError('An unexpected error occurs!');
        }
    };
    const onCancel = async () => {
        // redirect to index /recipes 
        await navigateToRecipes();
    }

</script>

<RecipeForm 
    recipeToEdit={data.recipeData}
    onSubmit={(recipeData) => onUpdateRecipe(recipeData as UpdateRecipeData)}
    {onCancel}
    />

<style>

</style>