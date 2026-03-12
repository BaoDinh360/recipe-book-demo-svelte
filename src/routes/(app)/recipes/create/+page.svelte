<script lang="ts">
	import RecipeForm from "$lib/components/recipe-form/RecipeForm.svelte";
	import { notiManager } from "$lib/states/notification-state.svelte";
	import type { CreateRecipePayload } from "$lib/types/recipe-types";
	import { navigateToMyRecipes } from "$lib/utils/navigation";
	import type { PageProps } from "./$types";

    // path: /recipes/create/

    let { data }: PageProps = $props();

    // $effect(() => {
    //     // display error noti if error
    //     if(data.errorMsg) {
    //         notifyError(data.errorMsg);
    //     }
    // })

    const onCreateRecipe = async(recipePayload: CreateRecipePayload): Promise<void> => {
        let notiMessage = '';
        try {
            const response = await fetch('/api/recipes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(recipePayload)
            });
            const result = await response.json();
            // success
            if(response.ok && result.success) {
                // back to index /recipes
                await navigateToMyRecipes();
                // show success noti
                notiMessage = `New recipe created successfully !`;
                notiManager.notifySuccess(notiMessage);
            } else {
                // failed
                notiMessage = `Failed to create new recipe: ${result.message}`;
                notiManager.notifyError(notiMessage);
            }
        } catch (err) {
            // unhandled error occurs at UI level
            notiManager.notifyError(`An unexpected error occurs!: ${(err as any).message}`);
        }
    }
    const onCancel = async () => {
        // redirect to index /recipes 
        await navigateToMyRecipes();
    }

</script>

<main class="flex h-full grow flex-col px-4 md:px-10 lg:px-40 py-5 pt-8">
    <RecipeForm
        ingredientSelects={data.ingredientSelects}
        onSubmit={onCreateRecipe}
        {onCancel}/>
</main>

<style></style>