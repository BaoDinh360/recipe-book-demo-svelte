<script lang="ts">
	import { goto } from "$app/navigation";
	import RecipeForm from "$lib/components/RecipeForm.svelte";
	import type { UpdateRecipeData } from "$lib/recipe-types";
	import { updateRecipe } from "$lib/utils/recipe-service";
	import type { PageProps } from "./$types";

    // path: /recipes/edit/{id}

    let { data }: PageProps = $props();

    const { recipeData } = data;

    const onUpdateRecipe = async (recipeData: UpdateRecipeData) : Promise<void> => {
        console.log('recipeData received: ', recipeData);
        try {
            const updated = await updateRecipe(recipeData);
            if(updated !== null) {
                // temp: use toast msg later
                console.log('Update recipe: {id} success: ', recipeData.id);
                // go back to index /recipes page
                await goto('/recipes');
            }
            else {
                console.log('Failed to update recipe: ', recipeData.id);
            }
        } catch (error) {
            console.error('Failed to update recipe id: {id}, error: ', recipeData.id, error);
        }
    };
    const onCancel = () => {
        // redirect to index /recipes 
        goto('/recipes');
    }

</script>

<RecipeForm 
    recipeToEdit={recipeData}
    onSubmit={(recipeData) => onUpdateRecipe(recipeData as UpdateRecipeData)}
    {onCancel}
    />

<style>

</style>