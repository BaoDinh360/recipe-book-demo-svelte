<script lang="ts">
	import { goto } from "$app/navigation";
	import RecipeForm from "$lib/components/recipe-form/RecipeForm.svelte";
	import type { UpdateRecipeData } from "$lib/recipe-types";
	import { notifyError, notifySuccess } from "$lib/stores/notification-stores";
	import { ClientResponseError } from "pocketbase";
	import type { PageProps } from "./$types";
	import { navigateToMyRecipes, navigateToRecipes } from "$lib/utils/navigation";

    // path: /recipes/edit/{id}

    let { data }: PageProps = $props();

    $effect(() => {
        // display error noti if error
        if(data.errorMsg) {
            notifyError(data.errorMsg);
        }
    })

    const onUpdateRecipe = async (recipeData: UpdateRecipeData) : Promise<void> => {
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
                navigateToMyRecipes();
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
        await navigateToMyRecipes();
    }

</script>

<main class="flex h-full grow flex-col px-4 md:px-10 lg:px-40 py-5 pt-8">
    <RecipeForm
        recipeToEdit={data.recipeData}
        ingredientSelects={data.ingredientSelects}
        onSubmit={(recipeData) => onUpdateRecipe(recipeData as UpdateRecipeData)}
        {onCancel}
    />
</main>

<style>

</style>