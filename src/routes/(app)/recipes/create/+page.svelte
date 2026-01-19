<script lang="ts">
	import RecipeForm from "$lib/components/recipe-form/RecipeForm.svelte";
	import type { CreateRecipeData } from "$lib/recipe-types";
	import { notifyError, notifySuccess } from "$lib/stores/notification-stores";
	import { navigateToMyRecipes, navigateToRecipes } from "$lib/utils/navigation";
	import type { PageProps } from "./$types";

    // path: /recipes/create/

    let { data }: PageProps = $props();

    $effect(() => {
        // display error noti if error
        if(data.errorMsg) {
            notifyError(data.errorMsg);
        }
    })

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
                await navigateToMyRecipes();
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
        await navigateToMyRecipes();
    }

</script>

<main class="flex h-full grow flex-col px-4 md:px-10 lg:px-40 py-5">
    <RecipeForm
        ingredientSelects={data.ingredientSelects}
        onSubmit={onCreateRecipe}
        {onCancel}/>
</main>


<style>

</style>