<script lang="ts">
	import RecipeForm from "$lib/components/recipe-form/RecipeForm.svelte";
	import { notifyError, notifySuccess } from "$lib/stores/notification-stores";
	import type { PageProps } from "./$types";
	import { navigateToMyRecipes } from "$lib/utils/navigation";
	import type { UpdateRecipePayload } from "$lib/types/recipe-types";

    // path: /recipes/edit/{id}

    let { data }: PageProps = $props();

    // $effect(() => {
    //     // display error noti if error
    //     if(data.errorMsg) {
    //         notifyError(data.errorMsg);
    //     }
    // })

    const onUpdateRecipe = async (recipePayload: UpdateRecipePayload) : Promise<void> => {
        let notiMessage = '';
        const recipeId = recipePayload.id;
        const recipeCode = data.recipeData?.recipeCode;
        try {
            const response = await fetch(`/api/recipes/${recipeId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(recipePayload)
            });
            const result = await response.json();
            // success
            if(response.ok && result.success) {
                navigateToMyRecipes();
                // show success noti
                notiMessage = `Update recipe: ${recipeCode} success!`;
                notifySuccess(notiMessage);
            } else {
                // failed
                notiMessage = `Update recipe ${recipeCode} failed!: ${result.message}`;
                notifyError(notiMessage);
            }
        } catch (err) {
            // unhandled error occurs at UI level
            notifyError(`An unexpected error occurs!: ${(err as any).message}`);
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
        onSubmit={(recipePayload) => onUpdateRecipe(recipePayload as UpdateRecipePayload)}
        {onCancel}
    />
</main>

<style></style>